import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Try using pdfjs-dist
async function main() {
  try {
    const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.mjs');
    console.log('loaded pdfjs');
  } catch(e) {
    console.log('pdfjs not available:', e.message);
  }

  // Fallback: read raw bytes and try to find text streams
  const buf = readFileSync('C:/Users/user/Desktop/clude/FP3_gakka_ichimonittou_2025_V2.pdf');
  console.log('PDF size:', buf.length, 'bytes');

  // Look for readable text in the PDF
  const str = buf.toString('latin1');

  // Find BT...ET blocks (text blocks in PDF)
  const textBlocks = [];
  let i = 0;
  while (i < str.length) {
    const btIdx = str.indexOf('BT\n', i);
    if (btIdx === -1) break;
    const etIdx = str.indexOf('ET', btIdx);
    if (etIdx === -1) break;
    textBlocks.push(str.substring(btIdx, etIdx + 2));
    i = etIdx + 2;
  }

  console.log('Text blocks found:', textBlocks.length);
  console.log('First 5 blocks:');
  textBlocks.slice(0, 5).forEach((b, i) => {
    console.log(`\n--- Block ${i+1} ---`);
    console.log(b.substring(0, 200));
  });
}

main().catch(console.error);
