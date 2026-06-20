const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

const files = [
  'WhatsApp Image 2026-06-13 at 17.37.08.jpeg',
  'WhatsApp Image 2026-06-13 at 17.37.09.jpeg',
  'WhatsApp Image 2026-06-13 at 17.37.09n.jpeg',
  'WhatsApp Image 2026-06-13 at 17.37.10.jpeg',
  'WhatsApp Image 2026-06-13 at 17.37.11.jpeg'
];

async function removeBackground() {
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    if (!fs.existsSync(filePath)) continue;
    
    console.log(`Processing ${file}...`);
    try {
      const image = await Jimp.read(filePath);
      const w = image.bitmap.width;
      const h = image.bitmap.height;
      
      const visited = new Uint8Array(w * h);
      const queue = [];
      
      // Start flood fill from the 4 corners to only erase the OUTSIDE background
      queue.push({x: 0, y: 0});
      queue.push({x: w - 1, y: 0});
      queue.push({x: 0, y: h - 1});
      queue.push({x: w - 1, y: h - 1});
      
      let head = 0;
      while (head < queue.length) {
        const {x, y} = queue[head++];
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        
        const idx = y * w + x;
        if (visited[idx]) continue;
        visited[idx] = 1;
        
        // Fast buffer access instead of getPixelColor for performance
        const pIdx = (y * w + x) * 4;
        const r = image.bitmap.data[pIdx + 0];
        const g = image.bitmap.data[pIdx + 1];
        const b = image.bitmap.data[pIdx + 2];
        
        // If the pixel is near-black, erase it and flood to neighbors
        if (r < 30 && g < 30 && b < 30) {
          image.bitmap.data[pIdx + 3] = 0; // Set alpha to 0
          queue.push({x: x + 1, y});
          queue.push({x: x - 1, y});
          queue.push({x, y: y + 1});
          queue.push({x, y: y - 1});
        }
      }

      const parsed = path.parse(filePath);
      const outPath = path.join(assetsDir, parsed.name + '.png');
      image.write(outPath);
      console.log(`Saved flood-filled image to ${outPath}`);
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
}

removeBackground();
