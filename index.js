const MAP_CONTAINER_ID = "map";
// const MAP_CENTER = [-122.447303, 37.753574];
// const MAP_ZOOM = 2;
const MAP_CENTER = [11.39085, 47.27574];
const MAP_ZOOM = 12;

const MVT_SOURCE_ID = "contours8989";
const TILE_KEY = "get_your_own_OpIi9ZULNHzrESv6T2vL";
const MVT_TILES = [
    "https://aips.siniswift.com/gis//spaces/features/NATURE/{z}_{x}_{y}.mvt",
    "https://aips.siniswift.com/gis//spaces/features/BASE/{z}_{x}_{y}.mvt",
];
const MVT_MINZOOM = 1;
const MVT_MAXZOOM = 15;

window.addEventListener("DOMContentLoaded", () => {
    initMap().then((map) => {
        addMVT(map);
        setupLayerControlPanel(map);
    });
});

function initMap() {
    return new Promise(async (resolve, reject) => {
        try {
            const map = new maplibregl.Map({
                container: MAP_CONTAINER_ID,
                center: MAP_CENTER,
                zoom: MAP_ZOOM,
                style: "./style-custom.json",
            });
            map.on("load", () => resolve(map));
            // map.on('zoom', () => {
            //     const zoom = map.getZoom();
            //     if (zoom < 5) {
            //         map.setLayoutProperty('controlledLayer', 'visibility', 'none');
            //     } else {
            //         map.setLayoutProperty('controlledLayer', 'visibility', 'visible');
            //     }
            // })
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
            let airport = await map.loadImage("/airport.png");
            const border = await map.loadImage("/border.png");
            const textBG = await map.loadImage("/text-bg-orange.png");
            const linePattner_orange = await map.loadImage('./line-pattenr.png');
            const linePattner_blue = await map.loadImage('./blue1.png');
            // Declare the image
            map.addImage("triangle-icon", image.data);
            map.addImage("airport-icon", airport.data);
            map.addImage("border", border.data);
            map.addImage('pattern-orange', linePattner_orange.data);
            map.addImage('pattern-blue', linePattner_blue.data);
            // map.addImage('text-bg', textBG.data);
            // 空域名称
            map.addLayer({
                id: "airspace-label-layer",
                type: "symbol",
                source: "baseMvt",
                minzoom: 2,
                "source-layer": "airspace_line_202507",
                layout: {
                    "symbol-placement": "line",
                    "text-field": ["get", "codeId"],
                    "text-size": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        1,
                        8,
                        2,
                        9,
                        3,
                        11, 4, 12, 5, 13
                    ],
                    "text-offset": [0, 1],
                    "text-optional": true
                },
                paint: {
                    "text-color": "#000",
                    "text-halo-color": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        "#eecf68",
                        22,
                        "#eecf68"
                    ],
                    "text-halo-width": 30,
                    "text-halo-blur": 10
                },
            });
            // 航线名称
            // map.addLayer({
            //     id: "line-label",
            //     type: "symbol",
            //     source: "baseMvt", // 对应的 vector source
            //     "source-layer": "segment_202507", // 线图层名
            //     layout: {
            //         "symbol-placement": "line", // 关键属性，表示文字沿线分布
            //         "text-size": 12,
            //         "text-field": [
            //             "format",
            //             ["get", "txtDesigHigh"],
            //             {
            //                 "font-scale": 0.8,
            //                 "text-color": "#536577",
            //                 "text-halo-width": 0,
            //             },
            //         ], // 或固定文本，比如 "路线A"
            //         "text-letter-spacing": 0.05,
            //         "text-offset": [0, 2],
            //     },
            //     paint: {
            //     },
            //     minzoom: 6,
            // });
            // map.addLayer({
            //     id: "line-label-1",
            //     type: "symbol",
            //     source: "baseMvt", // 对应的 vector source
            //     "source-layer": "segment_202507", // 线图层名
            //     layout: {
            //         "symbol-placement": "line", // 关键属性，表示文字沿线分布
            //         "text-size": 12,
            //         "text-field": [
            //             "format",
            //             ["get", "valLen"],
            //             {
            //                 "font-scale": 0.8,
            //                 "text-color": "#536577",
            //                 "text-border-width": "3",
            //                 "text-halo-width": 0,
            //             },
            //             ["get", "uomDist"],
            //             {
            //                 "font-scale": 0.8,
            //                 "text-color": "#536577",
            //                 "text-halo-width": 0,
            //             },
            //             "\n",
            //             ["get", "txtDesig"],
            //             {
            //                 "font-scale": 1,
            //                 "text-color": "#fff",
            //                 "text-halo-width": 0,
            //             },
            //             "\n",
            //             ["get", "txtDesig"],
            //             {
            //                 "font-scale": 0.8,
            //                 "text-color": "#536577",
            //                 "text-halo-width": 0,
            //             }
            //         ], // 或固定文本，比如 "路线A"
            //         "text-letter-spacing": 0.05,
            //         "icon-image": "text-bg-t",
            //         "icon-offset": [3, 10],
            //         "icon-text-fit": "both",
            //         "icon-text-fit-padding": [1, 8, 1, 8],
            //     },
            //     paint: {
            //     },
            //     minzoom: 6,
            // });
            map.addLayer({
                id: "air-line-label",
                type: "symbol",
                source: "baseMvt", // 对应的 vector source
                "source-layer": "segment_202507", // 线图层名
                // 过滤出txtDesig不为空的数据和不为null的数据
                filter: [
                    "all",
                    ["!=", ["get", "txtDesig"], ""],
                    ["!=", ["get", "txtDesig"], null],
                    ["!=", ["get", "txtDesig"], " "]
                ],
                layout: {
                    "icon-image": "custom-icon",
                    // 图片偏移
                    "icon-offset": [3, 0],
                    "symbol-placement": "line", // 关键属性，表示文字沿线分布
                    "text-size": 12,
                    "icon-text-fit": "both",
                    "icon-text-fit-padding": [1, 8, 1, 8],
                    "text-field": ["get", "txtDesig"], // 或固定文本，比如 "路线A"
                    "text-letter-spacing": 0.05,
                },
                paint: {
                    "text-color": "#fff",
                },
                minzoom: 6,
            });
            // 航路点
            map.addLayer({
                id: "line-label-layer",
                type: "symbol",
                source: "baseMvt",
                minzoom: 5,
                "source-layer": "designated_point_202507",
                filter: ["==", ["get", "codeInAirway"], "Y"], // 过滤条件，只显示 codeInAirway 为 Y 的点
                layout: {
                    "symbol-placement": "point",
                    "icon-image": "triangle-icon",
                    "icon-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5, 0.3,
                        6, 0.5,
                        7, 0.8,
                        8, 1,
                    ],
                    "symbol-z-order": "viewport-y",
                    "text-field": ["get", "codeId"],
                    "text-size": 12,
                    "text-offset": [0, 1],
                    "text-optional": true
                },
                paint: {
                    "text-color": "#000",
                },
            });
            // 限制线文字
            // 限制图实现内侧阴影效果
            // const originalLine = turf.lineString(coordinates);
            // const offsetLine = turf.lineOffset(originalLine, -2, { units: 'meters' });
            map.addLayer({
                id: "restricted_line_label",
                // filter: ["==", ["get", "txtName"], "限制线"],
                type: "symbol",
                source: "baseMvt",
                "source-layer": "restricted_line_202507",
                minzoom: 6,
                layout: {
                    "symbol-placement": "line-center", // 关键属性，表示文字沿线分布
                    "text-field": ["get", "txtName"],
                    "text-size": 12,
                    "text-offset": [0, 1],
                    "text-anchor": "center",
                    "text-max-angle": 60,
                    "text-letter-spacing": 0,
                    "text-optional": true,
                    // "avoid-edge": true, // 避让地图边缘
                },
                paint: {
                    "text-color": "#000",
                    "text-halo-color": "#f6a708ff",
                    "text-halo-width": 4,
                    "text-halo-blur": 0.5
                },
            });
            // administrative 图层 行政区域
            // map.addLayer(
            //     {
            //         id: "administrativeLayer",
            //         type: "fill",
            //         source: "maplibreCountries",
            //         "source-layer": "land",
            //         paint: {
            //             "fill-color": "#fff",
            //             "fill-opacity": 1,
            //         },
            //     },
            //     "oceanLayer"
            // );

            // 添加机场轮廓
            // map.addLayer({
            //     id: "airport-lines",
            //     type: "line",
            //     source: "AMMMvt",
            //     "source-layer": "airport_area_region_line_202507",
            //     minzoom: 9,
            //     maxzoom: 24,
            //     paint: {
            //         "line-color": "#000000",
            //         "line-opacity": 1,
            //         "line-width": 1,
            //     },
            // });
        });
}

// controlledLayer 管制区  绿色
// restrictedLayer 限制区 黄色

// 图层控制面板实现
const LAYER_LIST = [
    { id: "line-label", name: "航线标注" },
    { id: "administrativeLayer", name: "行政区" },
    { id: "postalLayer", name: "邮政区划" },
    { id: "airport-lines", name: "机场轮廓" },
    { id: "controlledLayer", name: "管制区" },
    { id: "restrictedLayer", name: "限制区" },
    { id: "vorLayer", name: "VOR台" },
    { id: "ndbLayer", name: "NDB台" },
    { id: "airspaceLayer", name: "空域线" },
    { id: "segmentLayer", name: "航段线" },
    { id: "globel", name: "平面" },
    // 切换3D地形图
    { id: "terrain", name: "高程数据" },
];

function setupLayerControlPanel(map) {
    const panel = document.getElementById("layer-control-panel");
    panel.innerHTML = "<b>图层控制</b><br />";
    LAYER_LIST.forEach((layer) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = layer.id;
        checkbox.checked = true;
        checkbox.addEventListener("change", function () {
            if (layer.id === "globel") {
                // 平面/球面切换
                if (this.checked) {
                    map.setProjection({ type: "" }); // 平面
                } else {
                    map.setProjection({
                        type: "globe",
                    }); // 球面
                }
            } else if (layer.id === 'terrain') {
                if (this.checked) {
                    // map.addLayer({
                    //     "id": "mapbox-terrain-dem-layer",
                    //     "source": "mapbox-terrain-dem",
                    //     "type": "raster"
                    // }, "oceanLayer")
                    map.setTerrain({ 'source': 'mapbox-terrain-dem', 'exaggeration': 300 }); // 开启地形
                    map.addControl(new maplibregl.TerrainControl({
                        source: 'mapbox-terrain-dem',
                        exaggeration: 1
                    }));
                } else { }
            } else {
                const visibility = this.checked ? "visible" : "none";
                if (map.getLayer(layer.id)) {
                    map.setLayoutProperty(layer.id, "visibility", visibility);
                }
            }
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(layer.name));
        panel.appendChild(label);
    });
}
