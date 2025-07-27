const MAP_CONTAINER_ID = "map";
const MAP_CENTER = [-122.447303, 37.753574];
const MAP_ZOOM = 0;
const MVT_SOURCE_ID = "contours8989";
const TILE_KEY = "get_your_own_OpIi9ZULNHzrESv6T2vL";
const MVT_TILES = [
    "https://aips.siniswift.com/gis//spaces/features/NATURE/{z}_{x}_{y}.mvt",
    "https://aips.siniswift.com/gis//spaces/features/BASE/{z}_{x}_{y}.mvt",
];
const MVT_MINZOOM = 0;
const MVT_MAXZOOM = 15;

window.addEventListener("DOMContentLoaded", () => {
    initMap().then((map) => {
        addMVT(map);
        setupDeckLayer(map);
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
            map.on("style.load", () => resolve(map));
        } catch (e) {
            reject(e);
        }
    });
}

// 叠加deck图层
function setupDeckLayer(map) {
    const firstLabelLayerId = "oceanLayer";
    const {
        MapboxOverlay,
        ScatterplotLayer,
        ArcLayer,
        GeoJsonLayer,
        IconLayer,
        MVTLayer,
        PathStyleExtension,
        DataFilterExtension,
    } = deck;

    const extensionsMap = {
        PathStyleExtension: PathStyleExtension,
        DataFilterExtension: DataFilterExtension,
    };
    console.log("deck", deck);
    const deckOverlay = new MapboxOverlay({
        interleaved: true,
        layers: [
            new ScatterplotLayer({
                id: "deckgl-circle",
                data: [
                    { position: [-122.402, 37.79], color: [255, 0, 0], radius: 1000 },
                ],
                getPosition: (d) => d.position,
                getFillColor: (d) => d.color,
                getRadius: (d) => d.radius,
                opacity: 0.3,
                beforeId: firstLabelLayerId,
            }),
            new ArcLayer({
                id: "deckgl-arc",
                data: [
                    {
                        source: [-122.3998664, 37.7883697],
                        target: [-122.400068, 37.7900503],
                    },
                ],
                getSourcePosition: (d) => d.source,
                getTargetPosition: (d) => d.target,
                getSourceColor: [255, 208, 0],
                getTargetColor: [0, 128, 255],
                getWidth: 8,
            }),
            new GeoJsonLayer({
                id: 'airports',
                data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson',
                filled: true,
                lineWidthMinPixels: 1,
                getFillColor: [255, 255, 255],
                pointRadiusMinPixels: 2,
                pointRadiusScale: 2000,
                getPointRadius: f => 11 - f.properties.scalerank,
                pickable: true,
                autoHighlight: true,
            }),
            // new GeoJsonLayer({
            //     id: 'dataj',
            //     data: Array.isArray(dataj)
            //         ? dataj.map(f => {
            //             // 仅处理Feature类型
            //             if (f && f.geometry && Array.isArray(f.geometry.coordinates)) {
            //                 let newF = JSON.parse(JSON.stringify(f));
            //                 // 只处理Point/LineString/Polygon
            //                 if (f.geometry.type === 'Point') {
            //                     newF.geometry.coordinates = f.geometry.coordinates.map(c => c * 100);
            //                 } else if (f.geometry.type === 'LineString') {
            //                     newF.geometry.coordinates = f.geometry.coordinates.map(coord => coord.map(c => c * 100));
            //                 } else if (f.geometry.type === 'Polygon') {
            //                     newF.geometry.coordinates = f.geometry.coordinates.map(ring => ring.map(coord => coord.map(c => c * 100)));
            //                 }
            //                 return newF;
            //             }
            //             return f;
            //         })
            //         : dataj,
            //     filled: false,
            //     lineWidthMinPixels: 1,
            //     getFillColor: [255, 0, 0],
            //     pointRadiusMinPixels: 2,
            //     pointRadiusScale: 2000,
            //     getPointRadius: f => 11 - f.properties.scalerank,
            //     pickable: true,
            //     autoHighlight: true,
            // }),
            new MVTLayer({
                binary: false,
                // minZoom: 0,
                // maxZoom: 14,
                getLineColor: [255, 0, 0],
                getLineWidth: 1,
                lineWidthMinPixels: 1,
                pickable: true,
                id: `my-mvt-layer`,
                // tileSize: 256, // 尝试不同的瓦片大小
                data: "https://aips.siniswift.com/gis/spaces/features/BASE/{z}_{x}_{y}.mvt",

                renderSubLayers: (prop) => {
                    const { tile } = prop;
                    console.log('tile', prop)
                    // 放大所有坐标100倍
                    const num = 512
                    function scaleCoords(geom) {
                        if (!geom || !geom.type || !geom.coordinates) return geom;
                        let g = JSON.parse(JSON.stringify(geom));
                        if (g.type === 'Point') {
                            g.coordinates = g.coordinates.map(c => c * num);
                        } else if (g.type === 'LineString') {
                            g.coordinates = g.coordinates.map(coord => coord.map(c => c * num));
                        } else if (g.type === 'Polygon') {
                            g.coordinates = g.coordinates.map(ring => ring.map(coord => coord.map(c => c * num)));
                        } else if (g.type === 'MultiPoint') {
                            g.coordinates = g.coordinates.map(coord => coord.map(c => c * num));
                        } else if (g.type === 'MultiLineString') {
                            g.coordinates = g.coordinates.map(line => line.map(coord => coord.map(c => c * num)));
                        } else if (g.type === 'MultiPolygon') {
                            g.coordinates = g.coordinates.map(poly => poly.map(ring => ring.map(coord => coord.map(c => c * num))));
                        }
                        return g;
                    }
                    let data = tile.data;
                    if (Array.isArray(data)) {
                        data = data.map(f => {
                            if (f && f.geometry) {
                                let newF = JSON.parse(JSON.stringify(f));
                                newF.geometry = scaleCoords(f.geometry);
                                return newF;
                            }
                            return f;
                        });
                    } else if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
                        data = {
                            ...data,
                            features: data.features.map(f => {
                                if (f && f.geometry) {
                                    let newF = JSON.parse(JSON.stringify(f));
                                    newF.geometry = scaleCoords(f.geometry);
                                    return newF;
                                }
                                return f;
                            })
                        };
                    }
                    console.log('data', data)
                    return new GeoJsonLayer({
                        id: `mvt-sub-layer-${tile.index.x}-${tile.index.y}-${tile.index.z}`,
                        data: data,
                        filled: false,
                        lineWidthMinPixels: 2,
                        getFillColor: [255, 0, 0],
                        // pointRadiusMinPixels: 2,
                        // pointRadiusScale: 2000,
                        // getPointRadius: f => 11 - f.properties.scalerank,
                        pickable: true,
                        autoHighlight: true,
                    });
                },
            }),
        ],
    });
    map.addControl(deckOverlay);
    // 获取全部图层
    console.log("map.getStyle()", deckOverlay, map.getStyle());
}

function addMVT(map) {
    fetch("./tiles.json")
        .then((res) => res.json())
        .then(async (res) => {
            console.log(res);
            let image = await map.loadImage("/triangle-fill.png");
            let airport = await map.loadImage("/airport.png");
            const border = await map.loadImage("/border.png");
            map.addImage("triangle-icon", image.data);
            map.addImage("airport-icon", airport.data);
            map.addImage("border", border.data);
            // 航线名称
            // map.addLayer({
            //   id: "line-label",
            //   type: "symbol",
            //   source: "baseMvt", // 对应的 vector source
            //   "source-layer": "segment_202507", // 线图层名
            //   layout: {
            //     "symbol-placement": "line", // 关键属性，表示文字沿线分布
            //     "text-field": [
            //       "format",
            //       ["get", "valLen"],
            //       { "font-scale": 0.8 ,'text-color':'#536577','text-border-width':'3'},
            //       ["get", "uomDist"],
            //       { "font-scale": 0.8 ,'text-color':'#536577'},
            //       "\n",
            //       ["get", "txtDesig"],
            //       { "font-scale": 1 },
            //       "\n",
            //       ["get", "txtDesigHigh"],
            //       { "font-scale": 0.8 ,'text-color':'#536577'},
            //     ], // 或固定文本，比如 "路线A"
            //     "text-font": ["Open Sans Bold"],
            //     "text-size": 14,
            //     "text-rotation-alignment": "map", // 文字跟随线条旋转
            //     "text-pitch-alignment": "viewport", // 适配3D时有用
            //   },
            //   paint: {
            //     "text-color": "#000",
            //     "text-halo-color": "#fff",
            //     "text-halo-width": 1,
            //   },
            // });
            map.addLayer({
                id: "line-label",
                type: "symbol",
                source: "baseMvt", // 对应的 vector source
                "source-layer": "segment_202507", // 线图层名
                layout: {
                    "symbol-placement": "line", // 关键属性，表示文字沿线分布
                    "text-size": 14,
                    // "icon-image": 'border',
                    // "symbol-spacing": [
                    //   "interpolate",
                    //   ["linear"],
                    //   ["zoom"],
                    //   11,
                    //   400,
                    //   14,
                    //   600,
                    //   16,
                    //   800,
                    //   22,
                    //   1200,
                    // ],
                    // "symbol-placement": ["step", ["zoom"], "point", 11, "line"],
                    // "text-rotation-alignment": "viewport",
                    "icon-text-fit": "both",
                    "icon-text-fit-padding": [2, 5, 2, 5],

                    "text-field": [
                        "format",
                        ["get", "valLen"],
                        {
                            "font-scale": 0.8,
                            "text-color": "#536577",
                            "text-border-width": "3",
                            "text-halo-width": 0,
                        },
                        ["get", "uomDist"],
                        {
                            "font-scale": 0.8,
                            "text-color": "#536577",
                            "text-halo-width": 0,
                        },
                        "\n",
                        ["get", "txtDesig"],
                        {
                            "font-scale": 1,
                            "text-halo-width": 1,
                            "text-halo-blur": 0.7,
                            "text-halo-color": "#ffffff",
                        },
                        "\n",
                        ["get", "txtDesigHigh"],
                        {
                            "font-scale": 0.8,
                            "text-color": "#536577",
                            "text-halo-width": 0,
                        },
                    ], // 或固定文本，比如 "路线A"
                    "text-letter-spacing": 0.05,
                },
                paint: {},
            });
            // 航路点
            // map.addLayer({
            //   id: "line-label-layer",
            //   type: "symbol",
            //   source: "baseMvt",
            //   "source-layer": "segment_202507",
            //   layout: {
            //     "icon-image": "triangle-icon",
            //     "icon-size": 1,
            //     "symbol-z-order": "viewport-y",
            //     "text-field": ["get", "codePointStart"],
            //     "text-font": ["Open Sans Italic"],
            //     "text-size": 12,
            //     "text-offset": [0, 1],
            //   },
            //   paint: {
            //     "text-color": "#ff0000",
            //   },
            // });
            // administrative 图层 行政区域
            map.addLayer(
                {
                    id: "administrativeLayer",
                    type: "fill",
                    source: "maplibreCountries",
                    "source-layer": "land",
                    paint: {
                        "fill-color": "#792dcb",
                        "fill-opacity": 0.5,
                    },
                },
                "oceanLayer"
            );
            // 邮政区划 postal 邮局
            map.addLayer(
                {
                    id: "postalLayer",
                    type: "fill",
                    source: "maplibreCountries",
                    "source-layer": "postal",
                    minzoom: 6,
                    maxzoom: 11,
                    paint: {
                        "fill-color": "#0000ff",
                        "fill-opacity": 1,
                    },
                },
                "oceanLayer"
            );

            // 添加机场轮廓
            map.addLayer({
                id: "airport-lines",
                type: "line",
                source: "AMMMvt",
                "source-layer": "airport_area_region_line_202507",
                minzoom: 9,
                maxzoom: 24,
                paint: {
                    "line-color": "#000000",
                    "line-opacity": 1,
                    "line-width": 1,
                },
            });
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
