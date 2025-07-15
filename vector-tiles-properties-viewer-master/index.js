var { VectorTile, VectorTileLayer} = require('@mapbox/vector-tile');
var Protobuf = require('pbf');

const TILE_URL = 'https://aips.siniswift.com/gis/spaces/features/BASE/6_19_18.mvt';
const SOURCE_LAYER_NAME = 'Earth Cover';

fetch(TILE_URL).then(async response => {
    const data = await response.arrayBuffer();
    const tile = new VectorTile(new Protobuf(data));
    console.log('ile.layers',tile.layers)
    Object.keys(tile.layers).map(layerID => {

        const layer = tile.layers[layerID];
        if (layer.name === SOURCE_LAYER_NAME) {
            console.log(layer.feature(0).properties)
        }
    })
})

