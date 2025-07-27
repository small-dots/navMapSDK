{
    "id": "airport-label-layer",
        "type": "symbol",
            "source": "baseMvt",
                "source-layer": "ad_hp_202507",
                    "layout": {
        "icon-image": "airport-icon",
            "icon-size": 0.1,
                "symbol-z-order": "viewport-y",
                    "text-field": [
                        "get",
                        "codeId"
                    ],
                        "text-font": [
                            "Open Sans Italic"
                        ],
                            "text-size": 12,
                                "text-offset": [
                                    0,
                                    1
                                ]
    },
    "paint": {
        "text-color": "#162626"
    }
},
{
    "id": "airspaceLayer",
        "type": "line",
            "source": "baseMvt",
                "source-layer": "airspace_line_202507",
                    "paint": {
        "line-color": "#434340",
            "line-opacity": 0.8,
                "line-width": 2
    }
},
{
    "id": "segmentLayer",
        "type": "line",
            "source": "baseMvt",
                "source-layer": "segment_202507",
                    "paint": {
        "line-color": "#162626",
            "line-opacity": 0.8,
                "line-width": 1
    }
},
{
    "id": "controlledLayer",
        "type": "line",
            "source": "baseMvt",
                "source-layer": "controlled_line_202507",
                    "paint": {
        "line-color": "#0A8A24",
            "line-opacity": 0.8,
                "line-width": 1
    }
},
{
    "id": "restrictedLayer",
        "type": "line",
            "source": "baseMvt",
                "source-layer": "restricted_line_202507",
                    "paint": {
        "line-color": "#F6A708",
            "line-opacity": 0.8,
                "line-width": 1
    }
},
{
    "id": "vorLayer",
        "type": "circle",
            "source": "baseMvt",
                "source-layer": "vor_202507",
                    "paint": {
        "circle-color": "#CD97F0",
            "circle-opacity": 0.8,
                "circle-radius": 4
    }
},
{
    "id": "ndbLayer",
        "type": "circle",
            "source": "baseMvt",
                "source-layer": "ndb_202507",
                    "paint": {
        "circle-color": "#CD97F0",
            "circle-opacity": 0.8,
                "circle-radius": 4
    }
}






// MVT 图层绘制
// new MVTLayer({
//     binary: false,
//     maxCacheSize: 100,
//     id: `BaseBusinessLayer`,
//     data: "https://aips.siniswift.com/gis/spaces/features/BASE/{z}_{x}_{y}.mvt",
//     // data:url,
//     pickable: false,
//     subLayers: subLayers,
//     loadOptions: {},
//     renderSubLayers: (props) => {
//         console.log("props", props);
//         let allData = {};
//         if (props.data != null) {
//             props.data.forEach((feature) => {
//                 let spaceId = feature.properties.spaceId;
//                 allData[spaceId] = allData[spaceId] || [];
//                 props.subLayers.forEach((data) => {
//                     if (data.dataKey === spaceId && !data.needSpecificFilter) {
//                         allData[spaceId].push(feature);
//                     } else if (
//                         data.dataKey === spaceId &&
//                         data.needSpecificFilter &&
//                         data.specificField
//                     ) {
//                         let judgeIf = data.getSpecificData(
//                             feature,
//                             data.specificField
//                         );
//                         if (judgeIf) {
//                             allData[spaceId].push(feature);
//                         }
//                     }
//                 });
//             });
//         }
//         const baseLayer = new _BaseMvtLayer(props, {
//             id: props.id,
//             data: allData,
//             layersVisible: {
//                 segment: true,
//                 ad_hp: true,
//                 ndb: true,
//                 vor: true,
//                 designated_point: true,
//                 airspace_line: true,
//                 controlled_line: false,
//                 restricted_line: false,
//             },
//             sublayers: subLayers,
//             opacity: 1,
//         });
//         console.log("baseLayer", baseLayer);
//         return [baseLayer];
//     },
//     beforeId: firstLabelLayerId,
// }),
