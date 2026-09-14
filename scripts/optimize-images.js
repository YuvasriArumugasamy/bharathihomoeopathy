/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format
 * Run: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️  Image Optimization Script');
console.log('================================\n');

console.log('📦 Installing required packages...\n');
console.log('Run this command first:\n');
console.log('npm install --save-dev imagemin imagemin-webp\n');

console.log('📝 Then create this script:\n');

const scriptContent = `
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const path = require('path');

(async () => {
  console.log('🔄 Converting images to WebP...');
  
  // Convert assets folder images
  await imagemin(['src/assets/**/*.{jpg,png,jpeg}'], {
    destination: (file) => path.dirname(file.destinationPath),
    plugins: [
      imageminWebp({
        quality: 85,
        method: 6
      })
    ]
  });
  
  // Convert public folder images
  await imagemin(['public/**/*.{jpg,png,jpeg}'], {
    destination: (file) => path.dirname(file.destinationPath),
    plugins: [
      imageminWebp({
        quality: 85,
        method: 6
      })
    ]
  });
  
  console.log('✅ Images converted to WebP!');
  console.log('📊 Check file sizes to see savings');
})();
`;

console.log(scriptContent);

console.log('\n💡 Or use online tool (Easier):');
console.log('   https://squoosh.app/\n');

console.log('✅ After conversion:');
console.log('   - Original PNG/JPG files will still work');
console.log('   - WebP will be served automatically');
console.log('   - Fallback to PNG/JPG for old browsers\n');
