import fs from 'fs';
import jpeg from 'jpeg-js';

const imgPath = 'c:/Users/bidirr/Desktop/kisiselsite/public/sequence/hero/ezgif-frame-001.jpg';

try {
  const jpegData = fs.readFileSync(imgPath);
  const rawImageData = jpeg.decode(jpegData, { useTArray: true });
  console.log(`Width: ${rawImageData.width}, Height: ${rawImageData.height}`);
  
  // Let's sample pixels from the bottom 50 rows
  const height = rawImageData.height;
  const width = rawImageData.width;
  const data = rawImageData.data; // RGBA Uint8Array
  
  let totalR = 0, totalG = 0, totalB = 0;
  let sampleCount = 0;
  
  // Sample the bottom 50 rows
  for (let y = height - 50; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      totalR += data[idx];
      totalG += data[idx + 1];
      totalB += data[idx + 2];
      sampleCount++;
    }
  }
  
  console.log('Average RGB of bottom 50 rows:', {
    r: totalR / sampleCount,
    g: totalG / sampleCount,
    b: totalB / sampleCount
  });

  // Let's also sample pixels from the top 50 rows for comparison
  let topR = 0, topG = 0, topB = 0;
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      topR += data[idx];
      topG += data[idx + 1];
      topB += data[idx + 2];
    }
  }

  console.log('Average RGB of top 50 rows:', {
    r: topR / sampleCount,
    g: topG / sampleCount,
    b: topB / sampleCount
  });
} catch (err) {
  console.error('Error analyzing image pixels:', err);
}
