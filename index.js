const MAP_CONTAINER_ID = "map";
const MAP_CENTER = [-122.447303, 37.753574];
const MAP_ZOOM = 3;
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
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=" + TILE_KEY,
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
    .then((res) => {
      console.log(res);
      //   map.addSource(MVT_SOURCE_ID, {
      //     // url: ftech
      //     ...res,
      //     type:"vector"
      //   });
      map.getSource(MVT_SOURCE_ID) && map.removeSource(MVT_SOURCE_ID);
      map.addSource(MVT_SOURCE_ID, {
        type: "vector",
        tiles: [
          "https://aips.siniswift.com/gis/spaces/features/NATURE/{z}_{x}_{y}.mvt",
        ],
        format: "mvt",
        minzoom: 0,
        maxzoom: 15,
      });

      map.addLayer({
        id: '898989',
        "source-layer": MVT_SOURCE_ID,
        source:MVT_SOURCE_ID,
        type: "circle",
        paint: { "circle-color": "red" },
      });

      console.log("laerys", map.getSource(MVT_SOURCE_ID));
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
