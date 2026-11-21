const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8, idatChunks = [], width = 0, height = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4, stride = 1 + width * bpp, pixels = Buffer.alloc(width * height * bpp);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * stride], rawRow = y * stride + 1, prevRow = (y - 1) * width * bpp, currRow = y * width * bpp;
    for (let x = 0; x < width * bpp; x++) {
      const val = raw[rawRow + x], left = x >= bpp ? pixels[currRow + x - bpp] : 0, up = y > 0 ? pixels[prevRow + x] : 0, upLeft = y > 0 && x >= bpp ? pixels[prevRow + x - bpp] : 0;
      let res = val;
      if (filter === 1) res = (val + left) & 0xff;
      else if (filter === 2) res = (val + up) & 0xff;
      else if (filter === 3) res = (val + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upLeft);
        res = (val + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 0xff;
      }
      pixels[currRow + x] = res;
    }
  }
  return { width, height, pixels };
}

function encodePNG(width, height, rgbaBuffer) {
  // Output uncompressed scanlines with filter byte 0 (None)
  const stride = 1 + width * 4;
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // Filter: None
    rgbaBuffer.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idatData = zlib.deflateSync(raw, { level: 9 });

  // CRC32 table
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = -1;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const crc = crc32(chunk.slice(4, 8 + len));
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width(4), height(4), bitDepth(1)=8, colorType(1)=6 (RGBA), comp(1)=0, filter(1)=0, interlace(1)=0
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Read original uploaded logo
const srcPath = 'C:/Users/bdcalling/.gemini/antigravity/brain/9704a4f2-78c7-4709-9aa5-28222b74e9c6/.user_uploaded/media_1795082330123_b1d1cdd1.png';
const { width, height, pixels } = decodePNG(srcPath);

// True content bounds
// { minX: 140, maxX: 886, minY: 285, maxY: 744, w: 746, h: 459 }
const pad = 6;
const cropX = Math.max(0, 140 - pad);
const cropY = Math.max(0, 285 - pad);
const cropW = Math.min(width - cropX, (886 - 140) + pad * 2);
const cropH = Math.min(height - cropY, (744 - 285) + pad * 2);

console.log('Cropping to:', { cropX, cropY, cropW, cropH });

const outWhitePixels = Buffer.alloc(cropW * cropH * 4);
const outOriginalPixels = Buffer.alloc(cropW * cropH * 4);

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((cropY + y) * width + (cropX + x)) * 4;
    const dstIdx = (y * cropW + x) * 4;

    const r = pixels[srcIdx];
    const g = pixels[srcIdx + 1];
    const b = pixels[srcIdx + 2];
    const a = pixels[srcIdx + 3];

    // Original cropped
    outOriginalPixels[dstIdx] = r;
    outOriginalPixels[dstIdx + 1] = g;
    outOriginalPixels[dstIdx + 2] = b;
    outOriginalPixels[dstIdx + 3] = a;

    // White version for dark backgrounds:
    // If it is the green part (g is significantly higher than r and b)
    const isGreen = g > 100 && g > r * 1.5 && g > b * 1.4;
    if (isGreen) {
      // Keep exact green
      outWhitePixels[dstIdx] = r;
      outWhitePixels[dstIdx + 1] = g;
      outWhitePixels[dstIdx + 2] = b;
      outWhitePixels[dstIdx + 3] = a;
    } else if (a > 10) {
      // It is the black/dark part: convert to bright pure white (#FFFFFF), preserving alpha!
      outWhitePixels[dstIdx] = 255;
      outWhitePixels[dstIdx + 1] = 255;
      outWhitePixels[dstIdx + 2] = 255;
      outWhitePixels[dstIdx + 3] = a;
    } else {
      outWhitePixels[dstIdx] = 0;
      outWhitePixels[dstIdx + 1] = 0;
      outWhitePixels[dstIdx + 2] = 0;
      outWhitePixels[dstIdx + 3] = 0;
    }
  }
}

const whitePng = encodePNG(cropW, cropH, outWhitePixels);
const originalPng = encodePNG(cropW, cropH, outOriginalPixels);

fs.writeFileSync('src/assets/images/logo-white.png', whitePng);
fs.writeFileSync('src/assets/images/logo.png', originalPng);

console.log('✅ Generated tightly-cropped logo files:');
console.log('  - src/assets/images/logo-white.png (size:', whitePng.length, 'bytes)');
console.log('  - src/assets/images/logo.png (size:', originalPng.length, 'bytes)');
