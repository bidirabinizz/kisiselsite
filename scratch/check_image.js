import fs from 'fs';

const imgPath = 'c:/Users/bidirr/Desktop/kisiselsite/public/sequence/hero/ezgif-frame-001.jpg';

function getJpegSize(buffer) {
  let i = 2; // skip FFD8
  while (i < buffer.length) {
    const marker = buffer.readUInt16BE(i);
    i += 2;
    // SOF0 (Start Of Frame 0) marker is 0xFFC0
    // SOF2 (Start Of Frame 2) marker is 0xFFC2
    if (marker === 0xffc0 || marker === 0xffc2) {
      i += 3; // skip segment length (2 bytes) and data precision (1 byte)
      const height = buffer.readUInt16BE(i);
      i += 2;
      const width = buffer.readUInt16BE(i);
      return { width, height };
    } else {
      const len = buffer.readUInt16BE(i);
      i += len;
    }
  }
  return null;
}

try {
  const buffer = fs.readFileSync(imgPath);
  console.log(`Buffer length: ${buffer.length} bytes`);
  const size = getJpegSize(buffer);
  console.log('JPEG Dimensions:', size);
} catch (err) {
  console.error('Error reading image:', err);
}
