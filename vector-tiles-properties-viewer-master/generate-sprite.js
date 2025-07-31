const fs = require('fs');
const path = require('path');
const spritezero = require('@mapbox/spritezero');
const sharp = require('sharp');

async function createSprite(inputFolder, outputName) {
  const icons = fs.readdirSync(inputFolder).filter(f => f.endsWith('.png'));

  const svgs = await Promise.all(
    icons.map(async file => {
      const buffer = fs.readFileSync(path.join(inputFolder, file));
      const name = path.basename(file, '.png');
      return {
        id: name,
        svg: await sharp(buffer).toFormat('svg').toBuffer()
      };
    })
  );

  const png = spritezero.generateLayout({
    imgs: svgs,
    pixelRatio: 1,
    format: true // 输出 PNG
  });

  fs.writeFileSync(`${outputName}.json`, JSON.stringify(png.layout));
  fs.writeFileSync(`${outputName}.png`, png.image);
}

createSprite('./icons', 'sprite');
