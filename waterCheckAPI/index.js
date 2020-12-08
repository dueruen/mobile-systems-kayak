// const base64 = "iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAH4SURBVHic7dvNSgJRGMbxx8mdm9q5iBZJV+LleQUH9FJmU9CihYHQIgZCRcK+tCwDU5t2g/mt8zjHMz6/lYwKL3/mLM5xzIRhGGJC+60H2Yxne4A0UESCfxFfup+25nDav4jj33DR52QJLWcCRSRQRAJFJIgiDoYjm3M4LYrY7X3bnMNpWs4EikigiAQeADx1dHIThwcAoXZ7sWg5EygigaeT7Ph0JxIoIoEiEigigSISKCKBIhIoIoEiEigigSISKCKBNxyNbc/gvGz90d1TnPPTYxx5GdtjIGt7gDgeWu/R64uzE2tzOB1xUtDszlxLKmxqIs6TVNhUR5xnF2EPLuI8ccMq4gKbhFXEDSwKu9c7lko5j0o5b3uMpYJmF5nLal3PP8S013eiKxSRIDP9377rWhPjsVb4JmYiznN120hiFmetFXFdhxqbGnHaoUTdacRpaY2aaMR1uBh67yKuso+RnYu4ys1dC4OfZH83Sl3EbdSCNj6+Blt/XxG3dN94xXOnD0ARKbR3JlBEAkUkUEQCRSRQRAJFJFBEAkUkUEQCRSRQRAJFJFBEAkUkUEQCRSRQRAJFJFBEAkUkUEQCRSTIAoAxBtVqdebNYrEI3/cBALlcDv1+H8aYZCd0gAcAQRBEcUqlEgqFAowx8H0/uq6Ai+kJCII/iOavdI2KpcsAAAAASUVORK5CYII=";

const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var PNG = require('png-js');

const waterColor = {
  r: 194,
  g: 206,
  b: 224,
  a: 255
}

const lineColor = {
  r: 95,
  g: 106,
  b: 248,
  a: 255
}

app.post('/', (req, res) => {
  const { base64Image } = req.body;  
  const imageBufferData = Buffer.from(base64Image, "base64");
  const image = new PNG(imageBufferData);

  let onWater = false;

  image.decode((pixels) => {
    let waterCount = 0;
    let notWaterCount = 0;
    for(let row = 35; row < 46; row++) {
      for(let col = 35; col < 46; col++) {
        const rowOffset = row * 81 * 4;
        const colOffset = col * 4;
        const offset = rowOffset + colOffset;
        const pixelColor = {
          r: pixels[offset],
          g: pixels[offset + 1],
          b: pixels[offset + 2],
          a: pixels[offset + 3]
        }
        console.log(pixelColor)
        if (pixelColor.r !== waterColor.r || pixelColor.g !== waterColor.g || pixelColor.b !== waterColor.b || pixelColor.a !== waterColor.a) {
          if (pixelColor.r !== lineColor.r || pixelColor.g !== lineColor.g || pixelColor.b !== lineColor.b || pixelColor.a !== lineColor.a) {
            notWaterCount++;
          }
        } else {
          waterCount++;
        }
      }
    }
    if (waterCount > notWaterCount - 1) {
      onWater = true;
    }
    console.log("Called on water: " + onWater)
    res.json({water: onWater});
  });
});

app.listen(port, () => {
  console.log(`Water check API listening at http://localhost:${port}`);
});