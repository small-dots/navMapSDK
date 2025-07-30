export default `\
#define SHADER_NAME arc-layer-vertex-shader
attribute vec3 positions;
attribute vec4 instanceSourceColors;
attribute vec4 instanceTargetColors;
attribute vec3 instanceSourcePositions;
attribute vec3 instanceSourcePositions64Low;
attribute vec3 instanceTargetPositions;
attribute vec3 instanceTargetPositions64Low;
attribute vec3 instancePickingColors;
attribute float instanceWidths;
attribute float instanceHeights;
attribute float instanceTilts;
uniform bool greatCircle;
uniform bool useShortestPath;
uniform float numSegments;
uniform float opacity;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform int widthUnits;
varying vec4 vColor;
varying vec2 uv;
varying float isValid;
float paraboloid(float distance, float sourceZ, float targetZ, float ratio) {
  // d: distance on the xy plane
  // r: ratio of the current point
  // p: ratio of the peak of the arc
  // h: height multiplier
  // z = f(r) = sqrt(r * (p * 2 - r)) * d * h
  // f(0) = 0
  // f(1) = dz
  float deltaZ = targetZ - sourceZ;
  float dh = distance * instanceHeights;
 
  if (dh == 0.0) {
    return sourceZ + deltaZ * ratio;
  }
  float unitZ = deltaZ / dh;
  float p2 = unitZ * unitZ + 1.0;
  // sqrt does not deal with negative values, manually flip source and target if delta.z < 0
  float dir = step(deltaZ, 0.0);
  float z0 = mix(sourceZ, targetZ, dir);
  float r = mix(ratio, 1.0 - ratio, dir);
  return sqrt(r * (p2 - r)) * dh + z0;
}
// offset vector by strokeWidth pixels
// offset_direction is -1 (left) or 1 (right)
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float width) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace * project_uViewportSize);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  return dir_screenspace * offset_direction * width / 2.0;
}
float getSegmentRatio(float index) {
  return smoothstep(0.0, 1.0, index / (numSegments - 1.0));
}
vec3 interpolateFlat(vec3 source, vec3 target, float segmentRatio) {
  float distance = length(source.xy - target.xy);
  float z = paraboloid(distance, source.z, target.z, segmentRatio);
  float tiltAngle = radians(instanceTilts);
  vec2 tiltDirection = normalize(target.xy - source.xy);
  vec2 tilt = vec2(-tiltDirection.y, tiltDirection.x) * z * sin(tiltAngle);
  return vec3(
    mix(source.xy, target.xy, segmentRatio) + tilt,
    z * cos(tiltAngle)
  );
}
/* Great circle interpolation
 * http://www.movable-type.co.uk/scripts/latlong.html
 */
float getAngularDist (vec2 source, vec2 target) {
  vec2 sourceRadians = radians(source);
  vec2 targetRadians = radians(target);
  vec2 sin_half_delta = sin((sourceRadians - targetRadians) / 2.0);
  vec2 shd_sq = sin_half_delta * sin_half_delta;
  float a = shd_sq.y + cos(sourceRadians.y) * cos(targetRadians.y) * shd_sq.x;
  return 2.0 * asin(sqrt(a));
}

const float ATAN_0_5 = 0.4636476090008061;
const float ATAN_0_75 = 0.6435011087932844;
const float ATAN_1_5 = 0.982793723247329;
const float ATAN_4 = 1.3258176636680326;


float calcAtan(float x){
  if (x == 0.0) return 0.0;
  float Y = 1.0/9.0;
  float Yend;
  for (float k = 3.0;k > 0.0;k -= 1.0){
    Y = 1.0 / (2.0*k-1.0) - x*x*Y;
    Yend = Y;
  }
  return Yend*x;
}

float Atan(float y, float x){
    float r = y / x;
    float result;
    bool flag = false;

    if(r < 0.0) {
      r = -r;
      flag = true;
    }
    
    if(r < 0.25){
      result = calcAtan(r);
    }else if(r < 0.75){
      result = ATAN_0_5 + calcAtan((r-0.5)/(1.0 + r*0.5));
    } else if(r < 1.0){
      result = ATAN_0_75 + calcAtan((r-0.75)/(1.0 + r*0.75));
    } else if(r < 2.0){
      result = ATAN_1_5 + calcAtan((r-1.5)/(1.0 + r*1.5));
    } else{
      result = ATAN_4 + calcAtan((r-4.0)/(1.0 + r*4.0));
    }

    if(flag) {
      result = -result;
    }

    if (x>0.0)  {  
        return result;  
    }  
    else if (y >= 0.0 && x < 0.0)  {  
        return result + PI;  
    }  
    else if (y < 0.0 && x < 0.0)   {  
        return result - PI;  
    }  
    else if (y > 0.0 && x == 0.0)  {  
        return PI / 2.0;  
    }  
    else if (y < 0.0 && x == 0.0)   {  
        return -1.0 * PI / 2.0;  
    }  
    else  {  
        return 0.0;  
    }  
}



vec3 interpolateGreatCircle(vec3 source, vec3 target, vec3 source3D, vec3 target3D, float angularDist, float t) {
  vec2 lngLat;
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  if(abs(angularDist - PI) < 0.001) {
    lngLat = (1.0 - t) * source.xy + t * target.xy;
  } else if(t == 0.0) {
    lngLat = source.xy;
  } else if(t == 1.0) {
    lngLat = target.xy;
  }
  else {
    float a = sin((1.0 - t) * angularDist) / sin(angularDist);
    float b = sin(t * angularDist) / sin(angularDist);
    vec3 p = source3D.yxz * a + target3D.yxz * b;
    lngLat = degrees(vec2(Atan(p.y, -p.x), Atan(p.z, length(p.xy)))); 
  }
  float z = paraboloid(angularDist * EARTH_RADIUS, source.z, target.z, t);
  return vec3(lngLat, z);
}
/* END GREAT CIRCLE */
void main(void) {
  geometry.worldPosition = instanceSourcePositions;
  geometry.worldPositionAlt = instanceTargetPositions;
  float segmentIndex = positions.x;
  float segmentRatio = getSegmentRatio(segmentIndex);
  float prevSegmentRatio = getSegmentRatio(max(0.0, segmentIndex - 1.0));
  float nextSegmentRatio = getSegmentRatio(min(numSegments - 1.0, segmentIndex + 1.0));
  // if it's the first point, use next - current as direction
  // otherwise use current - prev
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  isValid = 1.0;
  uv = vec2(segmentRatio, positions.y);
  geometry.uv = uv;
  geometry.pickingColor = instancePickingColors;
  vec4 curr;
  vec4 next;
  vec3 source;
  vec3 target;
  // Multiply out width and clamp to limits
  // mercator pixels are interpreted as screen pixels
  float widthPixels = clamp(
    project_size_to_pixel(instanceWidths * widthScale, widthUnits),
    widthMinPixels, widthMaxPixels
  );

  if ((greatCircle || project_uProjectionMode == PROJECTION_MODE_GLOBE) && project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
    source = project_globe_(vec3(instanceSourcePositions.xy, 0.0));
    target = project_globe_(vec3(instanceTargetPositions.xy, 0.0));
    float angularDist = getAngularDist(instanceSourcePositions.xy, instanceTargetPositions.xy);
    vec3 prevPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, prevSegmentRatio);
    vec3 currPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, segmentRatio);
    vec3 nextPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, nextSegmentRatio);

    nextPos = indexDir < 0.0 ? prevPos : nextPos;
    nextSegmentRatio = indexDir < 0.0 ? prevSegmentRatio : nextSegmentRatio;

    vec3 currPos64Low = mix(instanceSourcePositions64Low, instanceTargetPositions64Low, segmentRatio);
    vec3 nextPos64Low = mix(instanceSourcePositions64Low, instanceTargetPositions64Low, nextSegmentRatio);
    
    if(project_uProjectionMode == PROJECTION_MODE_GLOBE) {
      vec3 currcommon = project_globe_(vec3(currPos.xy, currPos.z));
      vec3 nextcommon = project_globe_(vec3(nextPos.xy, currPos.z));


      vec3 dir = normalize(cross(nextcommon - currcommon, currcommon)) * indexDir * widthPixels * positions.y / 2.0 / project_uScale;
      gl_Position = project_common_position_to_clipspace(vec4(currcommon - dir, 1.0));
      // gl_Position = currcommon + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);
    } else {
      curr = project_position_to_clipspace(currPos, currPos64Low, vec3(0.0), geometry.position);
      next = project_position_to_clipspace(nextPos, nextPos64Low, vec3(0.0));
      vec3 offset = vec3(
        getExtrusionOffset((next.xy - curr.xy) * indexDir, positions.y, widthPixels),
      0.0);
      DECKGL_FILTER_SIZE(offset, geometry);
      gl_Position = curr + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);
    }
  } else {
    vec3 source_world = instanceSourcePositions;
    vec3 target_world = instanceTargetPositions;
    if (useShortestPath) {
      source_world.x = mod(source_world.x + 180., 360.0) - 180.;
      target_world.x = mod(target_world.x + 180., 360.0) - 180.;
      float deltaLng = target_world.x - source_world.x;
      if (deltaLng > 180.) target_world.x -= 360.;
      if (deltaLng < -180.) source_world.x -= 360.;
    }
    source = project_position(source_world, instanceSourcePositions64Low);
    target = project_position(target_world, instanceTargetPositions64Low);
    // common x at longitude=-180
    float antiMeridianX = 0.0;
    if (useShortestPath) {
      if (project_uProjectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET) {
        antiMeridianX = -(project_uCoordinateOrigin.x + 180.) / 360. * TILE_SIZE;
      }
      float thresholdRatio = (antiMeridianX - source.x) / (target.x - source.x);
      if (prevSegmentRatio <= thresholdRatio && nextSegmentRatio > thresholdRatio) {
        isValid = 0.0;
        indexDir = sign(segmentRatio - thresholdRatio);
        segmentRatio = thresholdRatio;
      }
    }
    nextSegmentRatio = indexDir < 0.0 ? prevSegmentRatio : nextSegmentRatio;
    vec3 currPos = interpolateFlat(source, target, segmentRatio);
    vec3 nextPos = interpolateFlat(source, target, nextSegmentRatio);
    if (useShortestPath) {
      if (nextPos.x < antiMeridianX) {
        currPos.x += TILE_SIZE;
        nextPos.x += TILE_SIZE;
      }
    }
    curr = project_common_position_to_clipspace(vec4(currPos, 1.0));
    next = project_common_position_to_clipspace(vec4(nextPos, 1.0));
    geometry.position = vec4(currPos, 1.0);

    // extrude
    if(project_uProjectionMode == PROJECTION_MODE_GLOBE) {
      vec3 currcommon = project_globe_(vec3(currPos.xy, 0.0));
      vec3 nextcommon = project_globe_(vec3(nextPos.xy, 0.0));

      vec3 dir = normalize(cross(nextcommon - currcommon, currcommon)) * indexDir * widthPixels * positions.y / 2.0 / project_uScale;
      gl_Position = project_common_position_to_clipspace(vec4(currcommon - dir, 1.0));
    } else {
      vec3 offset = vec3(
        getExtrusionOffset((next.xy - curr.xy) * indexDir, positions.y, widthPixels),
      0.0);
      DECKGL_FILTER_SIZE(offset, geometry);
      gl_Position = curr + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);
    }

  }

  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  vec4 color = mix(instanceSourceColors, instanceTargetColors, segmentRatio);
  vColor = vec4(color.rgb, color.a * opacity);
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;