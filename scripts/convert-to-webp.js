/**
 * Automated Image to WebP Converter
 * Converts all PNG, JPG, JPEG images to WebP format
 * Maintains original files with .original extension as backup
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  quality: 85,
  effort: 6, // 0-6, higher = better compression but slower
  targetDirs: [
    path.join(__dirname, '../src/assets'),
    path.join(__dirname, '../public'),
  ],
  extensions: ['.png', '.jpg', '.jpeg'],
  skipFiles: ['favicon.png'], // Files to skip conversion
  createBackup: true, // Keep original files as .original
};

// Stats tracking
const stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  webpSize: 0,
};

// Get all image files recursively
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        getAllImageFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (CONFIG.extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Convert single image to WebP
async function convertToWebP(imagePath) {
  try {
    const fileName = path.basename(imagePath);
    const ext = path.extname(fileName);
    const nameWithoutExt = fileName.replace(ext, '');
    const dir = path.dirname(imagePath);
    
    // Skip if in skip list
    if (CONFIG.skipFiles.includes(fileName)) {
      console.log(`⏭️  Skipped: ${fileName} (in skip list)`);
      stats.skipped++;
      return;
    }

    // Check if WebP already exists
    const webpPath = path.join(dir, `${nameWithoutExt}.webp`);
    if (fs.existsSync(webpPath)) {
      console.log(`⏭️  Skipped: ${fileName} (WebP already exists)`);
      stats.skipped++;
      return;
    }

    // Get original file size
    const originalStats = fs.statSync(imagePath);
    const originalSize = originalStats.size;
    stats.originalSize += originalSize;

    // Convert to WebP
    await sharp(imagePath)
      .webp({ quality: CONFIG.quality, effort: CONFIG.effort })
      .toFile(webpPath);

    // Get WebP file size
    const webpStats = fs.statSync(webpPath);
    const webpSize = webpStats.size;
    stats.webpSize += webpSize;

    // Calculate savings
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    const originalKB = (originalSize / 1024).toFixed(1);
    const webpKB = (webpSize / 1024).toFixed(1);

    console.log(`✅ Converted: ${fileName}`);
    console.log(`   Original: ${originalKB} KB → WebP: ${webpKB} KB (${savings}% smaller)`);

    // Backup original file if enabled
    if (CONFIG.createBackup) {
      const backupPath = imagePath + '.original';
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(imagePath, backupPath);
        console.log(`   💾 Backup created: ${fileName}.original`);
      }
    }

    stats.converted++;
  } catch (error) {
    console.error(`❌ Error converting ${imagePath}:`, error.message);
    stats.errors++;
  }
}

// Format bytes to readable size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Main conversion function
async function convertAllImages() {
  console.log('🚀 Starting WebP Conversion Process...\n');
  console.log(`Configuration:`);
  console.log(`  - Quality: ${CONFIG.quality}%`);
  console.log(`  - Effort: ${CONFIG.effort}/6`);
  console.log(`  - Create Backup: ${CONFIG.createBackup ? 'Yes' : 'No'}`);
  console.log(`  - Target Directories: ${CONFIG.targetDirs.length}\n`);

  // Collect all image files
  const allImages = [];
  CONFIG.targetDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      console.log(`📁 Scanning: ${dir}`);
      const images = getAllImageFiles(dir);
      allImages.push(...images);
    }
  });

  stats.total = allImages.length;
  console.log(`\n📊 Found ${stats.total} images to process\n`);
  console.log('━'.repeat(60));

  // Convert each image
  for (const imagePath of allImages) {
    const relativePath = path.relative(process.cwd(), imagePath);
    console.log(`\n📷 Processing: ${relativePath}`);
    await convertToWebP(imagePath);
  }

  // Print summary
  console.log('\n' + '━'.repeat(60));
  console.log('\n🎉 Conversion Complete!\n');
  console.log('📊 Statistics:');
  console.log(`  ✅ Converted: ${stats.converted} images`);
  console.log(`  ⏭️  Skipped: ${stats.skipped} images`);
  console.log(`  ❌ Errors: ${stats.errors} images`);
  console.log(`  📦 Total: ${stats.total} images`);
  
  if (stats.converted > 0) {
    const totalSavings = ((stats.originalSize - stats.webpSize) / stats.originalSize * 100).toFixed(1);
    console.log(`\n💾 Storage Savings:`);
    console.log(`  Original Size: ${formatBytes(stats.originalSize)}`);
    console.log(`  WebP Size: ${formatBytes(stats.webpSize)}`);
    console.log(`  Space Saved: ${formatBytes(stats.originalSize - stats.webpSize)}`);
    console.log(`  Reduction: ${totalSavings}%`);
  }

  console.log('\n✨ Next Steps:');
  console.log('  1. Test the WebP images in your app');
  console.log('  2. Update import statements to use .webp extension');
  console.log('  3. Use <OptimizedImage> component for automatic fallback');
  console.log('  4. If everything works, you can delete .original files');
  console.log('\n');
}

// Run conversion
convertAllImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
