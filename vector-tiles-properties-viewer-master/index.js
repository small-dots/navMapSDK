// 把下方代码逻辑编写为一个服务器，前端通过http请求获取数据
// 服务器端代码
const express = require('express');
const app = express();

app.get('/tile', (req, res) => {
    var { VectorTile, VectorTileLayer } = require('@mapbox/vector-tile');
    var Protobuf = require('pbf');

    const TILE_URL = 'https://aips.siniswift.com/gis/spaces/features/BASE/8_213_104.mvt';
    const SOURCE_LAYER_NAME = 'Earth Cover';

    fetch(TILE_URL).then(async response => {
        const data = await response.arrayBuffer();
        const tile = new VectorTile(new Protobuf(data));
        // console.log('ile.layers',JSON.stringify(tile.layers))
        Object.keys(tile.layers).map(layerID => {

            const layer = tile.layers[layerID];
            if (layer.name === 'segment_202507') {
                res.send(layer.feature(1))
            }
        })
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})



