const MAP_CONTAINER_ID = "map";
const MAP_CENTER = [
    -122.447303,
    37.753574
];
const MAP_ZOOM = 3;
const MVT_SOURCE_ID = "contours";
const TILE_KEY = "get_your_own_OpIi9ZULNHzrESv6T2vL";
const MVT_TILES = [
    "https://aips.siniswift.com/gis//spaces/features/NATURE/{z}_{x}_{y}.mvt",
    "https://aips.siniswift.com/gis//spaces/features/BASE/{z}_{x}_{y}.mvt"
];
const MVT_MINZOOM = 0;
const MVT_MAXZOOM = 15;
function initMap() {
    return new Promise((resolve, reject)=>{
        try {
            const map = new maplibregl.Map({
                container: MAP_CONTAINER_ID,
                center: MAP_CENTER,
                zoom: MAP_ZOOM,
                style: "https://api.maptiler.com/maps/streets/style.json?key=" + TILE_KEY
            });
            map.on("load", ()=>resolve(map));
        } catch (e) {
            reject(e);
        }
    });
}
function addMVT(map) {
    fetch("./tiles.json").then((res)=>res.json()).then((res)=>{
        console.log(res);
        //   map.addSource(MVT_SOURCE_ID, {
        //     // url: ftech
        //     ...res,
        //     type:"vector"
        //   });
        //   map.addSource(MVT_SOURCE_ID, {
        //     type: "vector",
        //     tiles: [
        //       "https://aips.siniswift.com/gis//spaces/features/NATURE/{z}_{x}_{y}.mvt",
        //     ],
        //     format: "mvt",
        //     minzoom: 0,
        //     maxzoom: 15,
        //     tiles,
        //   });
        map.addLayer({
            id: MVT_SOURCE_ID,
            source: {
                type: "vector",
                tiles: MVT_TILES,
                minzoom: 0,
                maxzoom: 24
            },
            "source-layer": "layer",
            type: "circle",
            paint: {
                "circle-color": "red"
            }
        });
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

//# sourceMappingURL=MapSDK.c36f364e.js.map
