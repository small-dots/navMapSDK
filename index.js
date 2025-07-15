const MAP_CONTAINER_ID = "map";
const MAP_CENTER = [-122.447303, 37.753574];
const MAP_ZOOM = 2;
const MVT_SOURCE_ID = "contours8989";
const TILE_KEY = "get_your_own_OpIi9ZULNHzrESv6T2vL";
const MVT_TILES = [
  "https://aips.siniswift.com/gis//spaces/features/NATURE/{z}_{x}_{y}.mvt",
  "https://aips.siniswift.com/gis//spaces/features/BASE/{z}_{x}_{y}.mvt",
];
const MVT_MINZOOM = 0;
const MVT_MAXZOOM = 15;

function initMap() {
  return new Promise((resolve, reject) => {
    try {
      const map = new maplibregl.Map({
        container: MAP_CONTAINER_ID,
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        style: "./style-custom.json",
      });
      map.on("load", () => resolve(map));
    } catch (e) {
      reject(e);
    }
  });
}

function addMVT(map) {
  fetch("./tiles.json")
    .then((res) => res.json())
    .then(async (res) => {
      console.log(res);
      let image = await map.loadImage("/triangle-fill.png");
      map.addImage("triangle-icon", image.data);
      // 空域
      // map.addLayer({
      //   id: 'aisapacelayer',
      //   "source-layer": 'airspace_line_202507',
      //   source:'baseMvt',
      //   type: "line",
      //   "paint": {
      //     "line-color": "#a6b4f5",
      //     "line-opacity": 1,
      //     "line-width": 2
      //   }
      // });
      // 机场图标
      // map.addLayer({
      //   id: "airportLayer1",
      //   type: "circle",
      //   source: "baseMvt",
      //   "source-layer": "ad_hp_202507",
      //   paint: {
      //     "circle-color": "#ff0000",
      //     "circle-opacity": 1,
      //     "circle-radius": 6,
      //   },
      // });

      map.addLayer({
        id: "line-label",
        type: "symbol",
        source: "baseMvt", // 对应的 vector source
        "source-layer": "segment_202507", // 线图层名
        layout: {
          "symbol-placement": "line", // ✅ 关键属性，表示文字沿线分布
          "text-field": ["get", "txtDesig"], // 或固定文本，比如 "路线A"
          "text-font": ["Open Sans Bold"],
          "text-size": 14,
          "text-rotation-alignment": "map", // 文字跟随线条旋转
          "text-pitch-alignment": "viewport", // 适配3D时有用
        },
        paint: {
          "text-color": "#000",
          "text-halo-color": "#fff",
          "text-halo-width": 2,
        },
      });

      console.log("laerys", map.getSource("baseMvt"));
    });

  //   if (!map.getSource(MVT_SOURCE_ID)) {
  //     map.addSource(MVT_SOURCE_ID, {
  //       type: "vector",
  //       tiles: MVT_TILES,
  //       minzoom: MVT_MINZOOM,
  //       maxzoom: MVT_MAXZOOM,
  //     });
  //   }
}


// controlledLayer 管制区  绿色
// restrictedLayer 限制区 黄色