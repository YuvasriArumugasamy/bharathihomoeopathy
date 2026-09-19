/**
 * Video Compression Script
 * Compresses MP4 videos for web optimization
 * 
 * NOTE: This script provides instructions and recommendations.
 * Actual video compression requires FFmpeg installation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Video files to compress
const videosToCompress = [
  {
    path: path.join(__dirname, '../src/assets/animo-cover-ring-vertical-960p.mp4'),
    currentSize: '28.8 MB',
    targetSize: '5-8 MB',
    recommendations: {
      resolution: '720p (1280x720)',
      bitrate: '2000k',
      codec: 'H.264',
      fps: 30
    }
  },
  {
    path: path.join(__dirname, '../src/assets/bg-video1.mp4'),
    currentSize: '1.57 MB',
    targetSize: '800 KB - 1 MB',
    recommendations: {
      resolution: '720p (1280x720)',
      bitrate: '1500k',
      codec: 'H.264',
      fps: 30
    }
  },
  {
    path: path.join(__dirname, '../src/assets/WhatsApp Video 2026-08-26 at 20.01.57.mp4'),
    currentSize: '1.03 MB',
    targetSize: '500-700 KB',
    recommendations: {
      resolution: '480p (854x480)',
      bitrate: '1000k',
      codec: 'H.264',
      fps: 30
    }
  }
];

console.log('\n🎬 VIDEO COMPRESSION GUIDE');
console.log('═'.repeat(60));

// Check for FFmpeg
console.log('\n📦 Prerequisites:');
console.log('   This script requires FFmpeg to be installed.');
console.log('   FFmpeg is a powerful video processing tool.\n');

console.log('🔧 Installation Options:\n');

console.log('1️⃣  RECOMMENDED: Online Tools (No Installation)');
console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   • https://www.freeconvert.com/video-compressor');
console.log('   • https://www.veed.io/tools/video-compressor');
console.log('   • https://clideo.com/compress-video');
console.log('   • Upload → Compress → Download (Easy!)\n');

console.log('2️⃣  Windows: Chocolatey or Direct Download');
console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   • Download: https://ffmpeg.org/download.html');
console.log('   • Or via Chocolatey: choco install ffmpeg');
console.log('   • Add to PATH after installation\n');

console.log('3️⃣  Mac: Homebrew');
console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   • brew install ffmpeg\n');

console.log('4️⃣  Linux: Package Manager');
console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   • Ubuntu/Debian: sudo apt install ffmpeg');
console.log('   • Fedora: sudo dnf install ffmpeg\n');

console.log('\n' + '═'.repeat(60));
console.log('📹 VIDEOS TO COMPRESS');
console.log('═'.repeat(60) + '\n');

let totalCurrentSize = 0;
let totalTargetSize = 0;

videosToCompress.forEach((video, index) => {
  const exists = fs.existsSync(video.path);
  const fileName = path.basename(video.path);
  
  console.log(`\n${index + 1}. ${fileName}`);
  console.log('   ━'.repeat(30));
  console.log(`   📊 Current Size: ${video.currentSize}`);
  console.log(`   🎯 Target Size:  ${video.targetSize}`);
  console.log(`   📍 Status: ${exists ? '✅ Found' : '❌ Not Found'}`);
  
  if (exists) {
    const stats = fs.statSync(video.path);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   💾 Actual Size:  ${sizeMB} MB`);
    totalCurrentSize += parseFloat(sizeMB);
  }
  
  console.log('\n   🔧 Recommended Settings:');
  console.log(`      Resolution: ${video.recommendations.resolution}`);
  console.log(`      Bitrate:    ${video.recommendations.bitrate}`);
  console.log(`      Codec:      ${video.recommendations.codec}`);
  console.log(`      FPS:        ${video.recommendations.fps}`);
  
  // FFmpeg command
  const inputPath = video.path;
  const outputPath = video.path.replace('.mp4', '-compressed.mp4');
  const relativePath = path.relative(process.cwd(), video.path);
  
  console.log('\n   💻 FFmpeg Command:');
  console.log('   ━'.repeat(30));
  console.log(`   ffmpeg -i "${relativePath}" \\`);
  console.log(`      -c:v libx264 \\`);
  console.log(`      -preset slow \\`);
  console.log(`      -crf 28 \\`);
  console.log(`      -vf "scale=${video.recommendations.resolution === '720p (1280x720)' ? '1280:720' : '854:480'}" \\`);
  console.log(`      -b:v ${video.recommendations.bitrate} \\`);
  console.log(`      -r ${video.recommendations.fps} \\`);
  console.log(`      -c:a aac -b:a 128k \\`);
  console.log(`      "${relativePath.replace('.mp4', '-compressed.mp4')}"`);
});

console.log('\n\n' + '═'.repeat(60));
console.log('📊 EXPECTED RESULTS');
console.log('═'.repeat(60));
console.log(`\n   Current Total:  ${totalCurrentSize.toFixed(2)} MB`);
console.log(`   Expected Total: ~8-10 MB`);
console.log(`   Savings:        ~${(totalCurrentSize - 9).toFixed(2)} MB (${((totalCurrentSize - 9) / totalCurrentSize * 100).toFixed(1)}%)`);

console.log('\n\n' + '═'.repeat(60));
console.log('🚀 QUICK START GUIDE');
console.log('═'.repeat(60) + '\n');

console.log('✨ EASIEST METHOD (No Installation):');
console.log('   1. Go to: https://www.freeconvert.com/video-compressor');
console.log('   2. Upload each video file');
console.log('   3. Select quality: "Good Quality (720p)"');
console.log('   4. Click "Compress Now!"');
console.log('   5. Download compressed videos');
console.log('   6. Replace original files\n');

console.log('💻 USING FFMPEG (Advanced):');
console.log('   1. Install FFmpeg (see instructions above)');
console.log('   2. Copy the FFmpeg command for each video');
console.log('   3. Run in terminal/command prompt');
console.log('   4. Wait for compression to complete');
console.log('   5. Replace original with -compressed.mp4 version\n');

console.log('⚠️  IMPORTANT NOTES:');
console.log('   • Always backup original videos before replacing');
console.log('   • Test compressed videos before deploying');
console.log('   • Maintain aspect ratio during compression');
console.log('   • Use CRF 28 for good quality/size balance');
console.log('   • Consider lazy loading for large videos\n');

console.log('📝 AFTER COMPRESSION:');
console.log('   1. Replace original files with compressed versions');
console.log('   2. Test video playback in browser');
console.log('   3. Run: npm run build');
console.log('   4. Commit and push to GitHub');
console.log('   5. Vercel will auto-deploy optimized videos\n');

console.log('═'.repeat(60));
console.log('✅ VIDEO COMPRESSION GUIDE COMPLETE!');
console.log('═'.repeat(60) + '\n');
