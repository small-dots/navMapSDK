const {
  CompositeLayer,
  GeoJsonLayer,
  IconLayer,
  PathStyleExtension,
  DataFilterExtension,
} = deck;

const defaultProps1 = {};
const extensionMap = {
  PathStyleExtension: PathStyleExtension,
  DataFilterExtension: DataFilterExtension,
};
const layerMap = {
  GeoJsonLayer: GeoJsonLayer,
  IconLayer: IconLayer,
  NavArcLayer: NavArcLayer
};

function writeProps(props, overrideProps, layersVisible, viewport) {
  let minZoom = props.minZoom || 0;
  let maxZoom = props.maxZoom || 23;
  let zoom = viewport.zoom;
  let key = props.visibleKey || props.dataKey;
  overrideProps.visible =
    layersVisible[key] && zoom >= minZoom && zoom <= maxZoom;

  if (props.layerType == "IconLayer" && viewport.id == "MapView") {
    overrideProps.getAngle = 0;
  }
  if (props.filterminZoom) {
    overrideProps.filterEnabled = zoom <= props.filterminZoom;
    overrideProps.getFilterValue = props.getFilterValue;
    overrideProps.filterRange = props.filterRange;
  }
  if (typeof props.viewDepProps == "function") {
    props.viewDepProps(viewport, overrideProps);
  }

  writeColor(props, overrideProps, zoom);
  writeExtension(props, overrideProps);
}

function writeColor(props, overrideProps, zoom) {
  if (props.colorChangeZoom && zoom >= props.colorChangeZoom) {
    if (props.layerType == "NavArcLayer") {
      // overrideProps.getSourceColor = overrideProps.getTargetColor = props.colors[1];
      overrideProps.getSourceColor = overrideProps.getTargetColor = (d) => {
        return d.properties.txtRmk != "" && d.properties.txtRmk != undefined
          ? props.remarkColors[1]
          : props.colors[1];
      };
    } else {
      overrideProps.getColor = props.colors[1];
    }
  } else {
    if (props.layerType == "NavArcLayer") {
      // overrideProps.getSourceColor = overrideProps.getTargetColor = props.colors[1];
      overrideProps.getSourceColor = overrideProps.getTargetColor = (d) => {
        return d.properties.txtRmk != "" && d.properties.txtRmk != undefined
          ? props.remarkColors[0]
          : props.colors[0];
      };
    }
  }
}

function writeExtension(props, overrideProps) {
  if (props.extensions) {
    overrideProps.extensions = [];
    for (let key in props.extensions) {
      let extensionProp = props.extensions[key];
      let ext = new extensionMap[key](extensionProp);
      overrideProps.extensions.push(ext);
    }
  }
}

class _BaseMvtLayer extends CompositeLayer {
  shouldUpdateState({ changeFlags }) {
    return (
      (changeFlags.viewportChanged &&
        !this.context.deck.cursorState.isDragging) ||
      changeFlags.propsOrDataChanged
    );
  }
  renderLayers() {
    let { viewport } = this.context;
    let { id, data, subLayers, layersVisible } = this.props;
    let allProps = subLayers;
    let Layers = [];

    allProps.forEach((props) => {
      if (
        props.layerType !== "NavArcLayer"
      ) {
        console.log("props.layerType", props.layerType);
        let overrideProps = {};
        overrideProps.data = data[props.dataKey] || [];
        overrideProps.id = `${id}-${props.id}`;
        writeProps(props, overrideProps, layersVisible, viewport);
        let parentProps = props.layerType != "NavArcLayer" ? this.props : {};
        let Layer = new layerMap[props.layerType](
          parentProps,
          props,
          overrideProps,
          { beforeId: "oceanLayer" }
        );

        Layers.push(Layer);
      }
    });

    return Layers;
  }
}

_BaseMvtLayer.layerName = "_BaseMvtLayer";
_BaseMvtLayer.defaultProps = defaultProps1;
