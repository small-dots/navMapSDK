const subLayers = [
    // 空域线
    {
        layerType: 'GeoJsonLayer',
        id: 'airspaceLayer-boderLine',
        visibleKey: "airspace",
        dataKey: 'airspace_line',
        getLineColor: [135, 135, 135],
        getLineWidth: 1,
        lineWidthUnits: "pixels",
        pickable: true,
        needSpecificFilter: false,
    },
    // 空域延伸线
    {
        layerType: 'GeoJsonLayer',
        id: 'airspaceLayer-offsetLine',
        visibleKey: "airspace",
        dataKey: 'airspace_line',
        minZoom: 5,
        getLineColor: [171, 171, 171],
        getLineWidth: 5,
        lineWidthUnits: "pixels",
        getOffset: 0.5,
        getDashArray: [0.5, 5],
        parameters: {
            depthTest: false,
        },
        pickable: false,
        extensions: {
            PathStyleExtension: {
                offset: false,
                highPrecisionDash: true,
            }
        },
        needSpecificFilter: false,
    },
    // 航段
    {
        layerType: 'NavArcLayer',
        id: 'segmentLayer',
        dataKey: 'segment',
        minZoom: 4,
        colorChangeZoom: 5,
        colors: [
            [180, 180, 180, 200],
            [0, 0, 0, 200],
        ],
        remarkColors: [
            [255, 204, 0, 255],
            [255, 204, 0, 255]
        ],
        getSourceColor: [160, 160, 160, 200],
        getTargetColor: [160, 160, 160, 200],
        getSourcePosition: (f) => [f.properties.startX, f.properties.startY],
        getTargetPosition: (f) => [f.properties.endX, f.properties.endY],
        getWidth: 1,
        getHeight: 0,
        greatCircle: true,
        pickable: true,
        parameters: {
            depthTest: false,
        },
        needSpecificFilter: false,
    },
    // 管制区
    // {
    //     layerType: 'GeoJsonLayer',
    //     id: 'controlledLayer-boderLine',
    //     dataKey: 'controlled_line',
    //     minZoom: 4.5,
    //     getLineColor: [0, 184, 48, 150],
    //     getLineWidth: 2,
    //     lineWidthUnits: "pixels",
    //     pickable: true,
    //     needSpecificFilter: false,
    // },
    // // 限制区
    // {
    //     layerType: 'GeoJsonLayer',
    //     id: 'restricted-boderLine',
    //     dataKey: 'restricted_line',
    //     getLineColor: [158, 94, 71, 200],
    //     minZoom: 4.5,
    //     getLineWidth: 1,
    //     lineWidthUnits: "pixels",
    //     pickable: true,
    //     needSpecificFilter: false,
    // },
    // // 限制区延伸线
    // {
    //     layerType: 'GeoJsonLayer',
    //     id: 'restricted-offsetLine',
    //     dataKey: 'restricted_line',
    //     minZoom: 6,
    //     getLineColor: [179, 90, 46, 50],
    //     getLineWidth: 5,
    //     lineWidthUnits: "pixels",
    //     getOffset: 0.5,
    //     pickable: true,
    //     extensions: {
    //         PathStyleExtension: { offset: true }
    //     },
    //     needSpecificFilter: false,
    // },
    // ADIZ边界线，现在没有数据
    {
        layerType: 'GeoJsonLayer',
        id: 'adiz-boderLine',
        dataKey: 'adiz_line',
        visibleKey: "adiz",
        getLineColor: [4, 62, 63, 200],
        getLineWidth: 1,
        lineWidthUnits: "pixels",
        pickable: true,
        needSpecificFilter: false,
    },
    // adiz边界延伸线，现在没有数据
    {
        layerType: 'GeoJsonLayer',
        id: 'adiz-offsetLine',
        dataKey: 'adiz_line',
        visibleKey: "adiz",
        minZoom: 4,
        getLineColor: [3, 154, 157, 50],
        getLineWidth: 5,
        lineWidthUnits: "pixels",
        getOffset: 0.5,
        pickable: true,
        extensions: {
            PathStyleExtension: { offset: true }
        },
        needSpecificFilter: false,
    },
    // 报告点
    {
        layerType: 'IconLayer',
        id: 'designatedPointLayer',
        dataKey: 'designated_point',
        billboard: false,
        minZoom: 6,
        colorChangeZoom: 7,
        colors: [
            [0, 0, 0, 255],
            [0, 0, 0, 255],
        ],
        getAngle: 180,
        getColor: [0, 0, 0, 255],
        getSize: 20,
        iconAtlas: "./img/PointIcon/30/designate_point_inway.png",
        iconMapping: {
            designatedPointMarker: {
                x: 0,
                y: 0,
                width: 30,
                height: 30,
                // 为true支持调整颜色，false使用图片原始颜色
                mask: true,
            },
        },
        getIcon: (d) => "designatedPointMarker",
        getPosition: (d) => d.geometry.coordinates,
        pickable: true,
        needSpecificFilter: false,
        getSpecificData: (feature, fields) => {
            let judgeResult;
            Object.keys(fields).forEach(el => {
                if (fields[el] === feature.properties.codeInAirway) {
                    judgeResult = true
                }

            })
            return judgeResult

        },
        specificField: { "Inway": "Y" },
        index: 1,
    },
    {
        layerType: 'IconLayer',
        id: 'ndb-icon',
        dataKey: 'ndb',
        billboard: false,
        getAngle: 180,
        getSize: (d) => {
            let size;
            if (d.properties.zoom >= 6 && d.properties.zoom < 7) {
                size = 15;
            } else if (d.properties.zoom >= 7) {
                size = 20;
            } else {
                size = 20;
            }
            return size
        },
        minZoom: 6,
        getColor: [255, 0, 244],
        getPosition: (d) => d.geometry.coordinates,
        getIcon: (d) => {
            if (d.properties.codeInAirway == "Y") {
                return { url: "./img/PointIcon/30/NDB_inway.png", x: 0, y: 0, width: 30, height: 30, mask: true };
            } else {
                return { url: "./img/PointIcon/30/NDB_notinway.png", x: 0, y: 0, width: 30, height: 30, mask: true };
            }
        },
        pickable: true,
        needSpecificFilter: false,
        getSpecificData: (feature, fields) => {
            // console.log("fields",fields)
            //console.log(feature, fields);
            let judgeResult = false;
            if (fields.length > 0) {
                fields.forEach(el => {
                    if (el === feature.properties.codeInAirway) {
                        judgeResult = true;
                        return
                    }
                })
            }
            // console.log(feature, fields);
            // if (fields.length > 0) {
            //     for (let i = 0; i < fields.length; i++) {
            //       let el = fields[i];
            //       if (el ===  feature.properties.codeInAirway) {
            //         judgeResult = true;
            //         break 
            //       }
            //     }
            // }
            // console.log(judgeResult);
            return judgeResult
        },
        specificField: [{ "Inway": "Y" }],
    },
    {
        layerType: 'IconLayer',
        id: 'vor-icon',
        dataKey: 'vor',
        billboard: false,
        getAngle: 180,
        getSize: (d) => {
            let size;
            if (d.properties.zoom >= 6 && d.properties.zoom < 7) {
                size = 15;
            } else if (d.properties.zoom >= 7) {
                size = 20;
            } else {
                size = 20;
            }
            return size
        },
        minZoom: 6,
        getColor: [0, 0, 0],
        getIcon: (d) => {
            if (d.properties.codeInAirway == "Y") {
                return { url: "./img/PointIcon/30/VOR_inway.png", x: 0, y: 0, width: 30, height: 30, mask: true };
            } else {

                return { url: "./img/PointIcon/30/VOR_notinway.png", x: 0, y: 0, width: 30, height: 30, mask: true };
            }
        },
        getPosition: (d) => d.geometry.coordinates,
        pickable: true,
        needSpecificFilter: false,
        getSpecificData: (feature, fields) => {
            // let judgeResult = true;
            // if (fields.length > 0) {
            //   for (let i = 0; i < fields.length; i++) {
            //     let el = fields[i];
            //     if (el === feature.properties.codeInAirway) {
            //       judgeResult = true;
            //       break 
            //     }
            //   }
            // }
            //console.log(fields)
            let judgeResult = false;
            if (fields.length > 0) {
                fields.forEach(el => {
                    if (el === feature.properties.codeInAirway) {
                        judgeResult = true;
                        return
                    }
                })
            }
            return judgeResult

        },
        specificField: [{ "Inway": "Y" }],
    },
    // 非航路报告点
    {
        layerType: 'IconLayer',
        id: 'designatedPointNLayer',
        dataKey: 'designated_point_N',
        minZoom: 6,
        billboard: false,
        colorChangeZoom: 7,
        colors: [
            [0, 0, 0, 255],
            [0, 0, 0, 255],
        ],
        getColor: [0, 0, 0, 255],
        getAngle: 180,
        getSize: 20,
        iconAtlas: "./img/PointIcon/30/designate_point_notinway.png",
        iconMapping: {
            designatedPointMarker: { x: 0, y: 0, width: 30, height: 30, mask: true },
        },
        getIcon: (d) => "designatedPointMarker",
        getPosition: (d) => d.geometry.coordinates,
        pickable: true,
        needSpecificFilter: false,
        getSpecificData: (feature, fields) => {
            let judgeResult;
            Object.keys(fields).forEach(el => {
                if (fields[el] === feature.properties.codeInAirway) {
                    judgeResult = true
                }
            })
            // }
            return judgeResult

        },
        specificField: { "Inway": "Y" }
    },
    // 机场
    {
        layerType: 'IconLayer',
        id: 'airport-icon',
        dataKey: 'ad_hp',
        billboard: false,
        filterminZoom: 2,
        minZoom: 4,
        filterEnabled: true,
        getFilterValue: f => [f.properties.valLongRwy, f.properties.valElev],
        filterRange: [[0, 100], [0, 9999]],
        getAngle: 180,
        getSize: (d) => {
            let size;
            if (d.properties.zoom >= 4) {
                size = 33
            } else {
                size = 30
            }
            return size
        },
        getColor: [0, 0, 255, 255],
        extensions: {
            DataFilterExtension: { filterSize: 1 }
        },
        getIcon: (d) => {
            switch (d.properties.codeTypeMilOps) {
                case "MIL":
                    return { url: "./img/PointIcon/40/Airport_MIL.png", x: 0, y: 0, width: 40, height: 40, mask: true };
                case "MILEXT":
                    return { url: "./img/PointIcon/40/Airport_MILEXT.png", x: 0, y: 0, width: 40, height: 40, mask: true };
                default:
                    return { url: "./img/PointIcon/40/Airport_CIV.png", x: 0, y: 0, width: 40, height: 40, mask: true };
            }
        },
        getPosition: (d) => d.geometry.coordinates,
        pickable: true,
        needSpecificFilter: false,
        getSpecificData: (feature, fields) => {
            let judgeIf = true;
            fields.forEach((field) => {

                if (field.judge.length > 0) {
                    if (field.logic == "in") {
                        let result = field.judge.find(el => feature.properties[field.label] == el);
                        if (!result) {
                            judgeIf = false;
                            return
                        }
                    } else if (field.logic == "range") {
                        if (field.judge[0] > feature.properties[field.label] || field.judge[1] < feature.properties[field.label]) {
                            judgeIf = false;
                            return
                        }
                    }

                }
            })

            return judgeIf

        },
        specificField: [
            {
                "label": "codeId",
                "logic": "in",
                "judge": []
            },
            {
                "label": "valLongRwy",
                "logic": "range",
                "judge": [82, 9999]
            },
            {
                "label": "valElev",
                "logic": "range",
                "judge": [0, 9999]
            }
        ],
    },
    // 运规机场，无数据
    {
        layerType: 'IconLayer',
        id: 'airport-Op-icon',
        dataKey: 'ad_op',
        filterminZoom: 6,
        billboard: false,
        filterEnabled: true,
        getFilterValue: f => f.properties.valLongRwy,
        filterRange: [0, 10000],
        getAngle: 180,
        getSize: 15,
        getColor: [46, 139, 87, 200],
        extensions: {
            DataFilterExtension: { filterSize: 1 }
        },
        getIcon: (d) => {
            switch (d.properties.codeTypeMilOps) {
                case "MIL":
                    return { url: "./img/PointIcon/Airport_MIL.png", x: 0, y: 0, width: 18, height: 18, mask: true };
                case "MILEXT":
                    return { url: "./img/PointIcon/Airport_MILEXT.png", x: 0, y: 0, width: 18, height: 18, mask: true };
                default:
                    return { url: "./img/PointIcon/Airport_CIV.png", x: 0, y: 0, width: 18, height: 18, mask: true };
            }
        },
        getPosition: (d) => d.geometry.coordinates,
        pickable: true,
    },
    {
        layerType: 'GeoJsonLayer',
        id: 'mga',
        dataKey: 'mga',
        visibleKey: 'grids',
        minZoom: 7,
        stroked: false,
        filled: false,
        lineWidthMinPixels: 1,
        // getLineColor: [0, 0, 0, 255],
        // getFillColor: [50, 120, 130, 10],
        pointType: "text",
        getTxetAlignmentBaseline: "top",
        getTextAnchor: "start",
        getTextSize: 25,
        getTextColor: [255, 0, 0],
        sizeUnits: 'pixels',
        // textBillboard: false,
        getText: d => { return String(d.properties.valMga) },
        getTextPixelOffset: [40, -45],
        // viewDepProps: function (viewport, overrideProps) {
        //     overrideProps.getTextAngle = viewport.id == 'GlobeView' ?
        //         (d => d.properties.angle + 180) : (d => d.properties.angle);
        //     overrideProps.getTextSize = viewport.zoom * 3;
        // },
    },
    // // 经纬度网
    // {
    //   layerType: 'GeoJsonLayer',
    //   id: 'grids1',
    //   dataKey: 'grids',
    //   visibleKey: 'grids',
    //   minZoom: 7,
    //   stroked: true,
    //   filled: true,
    //   lineWidthMinPixels: 1,
    //   getLineColor: [0, 0, 0, 255],
    //   getFillColor: [50, 120, 130, 10],
    //   // pointType: "text",
    //   // getTxetAlignmentBaseline: "top",
    //   // getTextAnchor: "start",
    //   // textBillboard: false,
    //   //   getText: d =>{ return "bbbbbbbbb" + d.properties.geoLat + " " + d.properties.geoLong},
    //     // getTextPixelOffset: (d) => {
    //     //     return d.properties.id == "lng" ? [20, 15] : [-25, -15];
    //     // },
    //     // viewDepProps: function (viewport, overrideProps) {
    //     //     overrideProps.getTextAngle = viewport.id == 'GlobeView' ?
    //     //         (d => d.properties.angle + 180) : (d => d.properties.angle);
    //     //     overrideProps.getTextSize = viewport.zoom * 3;
    //     // },
    // },

    // {
    //     layerType: 'GeoJsonLayer',
    //     id: 'grids15',
    //     dataKey: 'GRID15',
    //     visibleKey: 'grids',
    //     maxZoom: 5,
    //     stroked: true,
    //     filled: false,
    //     lineWidthMinPixels: 1,
    //     getLineColor: [50, 130, 246, 150],
    //     pointType: "text",
    //     getTxetAlignmentBaseline: "top",
    //     getTextAnchor: "start",
    //     textBillboard: false,
    //     getText: d => d.properties.lng_lat,
    //     getTextPixelOffset: (d) => {
    //         return d.properties.id == "lng" ? [20, 15] : [-25, -15];
    //     },
    //     viewDepProps: function (viewport, overrideProps) {
    //         overrideProps.getTextAngle = viewport.id == 'GlobeView' ?
    //             (d => d.properties.angle + 180) : (d => d.properties.angle);
    //         overrideProps.getTextSize = viewport.zoom <= 3 ?
    //             (viewport.zoom * 7) : (viewport.zoom * 3);
    //     },
    // },
    // {
    //     layerType: 'GeoJsonLayer',
    //     id: 'grids5',
    //     dataKey: 'GRID5',
    //     visibleKey: 'grids',
    //     minZoom: 5,
    //     maxZoom: 8,
    //     stroked: true,
    //     filled: false,
    //     lineWidthMinPixels: 1,
    //     getLineColor: [50, 130, 246, 150],
    //     pointType: "text",
    //     getTxetAlignmentBaseline: "top",
    //     getTextAnchor: "start",
    //     textBillboard: false,
    //     getText: d => d.properties.lng_lat,
    //     getTextPixelOffset: (d) => {
    //         return d.properties.id == "lng" ? [20, 15] : [-25, -15];
    //     },
    //     viewDepProps: function (viewport, overrideProps) {
    //         overrideProps.getTextAngle = viewport.id == 'GlobeView' ?
    //             (d => d.properties.angle + 180) : (d => d.properties.angle);
    //         overrideProps.getTextSize = viewport.zoom * 3;
    //     },
    // },
    // {
    //     layerType: 'GeoJsonLayer',
    //     id: 'grids1',
    //     dataKey: 'GRID1',
    //     visibleKey: 'grids',
    //     minZoom: 8,
    //     stroked: true,
    //     filled: false,
    //     lineWidthMinPixels: 1,
    //     getLineColor: [50, 130, 246, 150],
    //     pointType: "text",
    //     getTxetAlignmentBaseline: "top",
    //     getTextAnchor: "start",
    //     textBillboard: false,
    //     getText: d => d.properties.lng_lat,
    //     getTextPixelOffset: (d) => {
    //         return d.properties.id == "lng" ? [20, 15] : [-25, -15];
    //     },
    //     viewDepProps: function (viewport, overrideProps) {
    //         overrideProps.getTextAngle = viewport.id == 'GlobeView' ?
    //             (d => d.properties.angle + 180) : (d => d.properties.angle);
    //         overrideProps.getTextSize = viewport.zoom * 3;
    //     },
    // },
    // {
    //     layerType: 'GeoJsonLayer',
    //     id: 'thrater-line',
    //     dataKey: 'thrater_line',
    //     visibleKey: 'thrater',
    //     filled: false,
    //     stroked: true,
    //     getLineColor: [0, 0, 0, 150],
    //     lineWidthMinPixels: 1,
    //     lineBillboard: false,
    // },

]
