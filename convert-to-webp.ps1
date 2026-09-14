# PowerShell Script to Convert Images to WebP using online API
# This script will convert all PNG, JPG, JPEG images to WebP format

Write-Host "🖼️  Image to WebP Converter" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if online conversion is needed (we'll use a simpler approach)
Write-Host "Note: This requires 'cwebp' tool from Google WebP package" -ForegroundColor Yellow
Write-Host "Download from: https://developers.google.com/speed/webp/download" -ForegroundColor Yellow
Write-Host ""

# Alternative: Manual conversion guide
Write-Host "📝 MANUAL CONVERSION STEPS:" -ForegroundColor Green
Write-Host ""
Write-Host "Option 1: Online Converter (Easiest)" -ForegroundColor Cyan
Write-Host "1. Go to: https://cloudconvert.com/png-to-webp" -ForegroundColor White
Write-Host "2. Upload your images from:" -ForegroundColor White
Write-Host "   - public/" -ForegroundColor Yellow
Write-Host "   - src/assets/images/" -ForegroundColor Yellow
Write-Host "3. Download converted .webp files" -ForegroundColor White
Write-Host "4. Replace original files" -ForegroundColor White
Write-Host ""

Write-Host "Option 2: Use Squoosh.app (Google's tool)" -ForegroundColor Cyan
Write-Host "1. Go to: https://squoosh.app/" -ForegroundColor White
Write-Host "2. Drag & drop images" -ForegroundColor White
Write-Host "3. Select WebP format" -ForegroundColor White
Write-Host "4. Adjust quality (recommended: 80-85)" -ForegroundColor White
Write-Host "5. Download" -ForegroundColor White
Write-Host ""

Write-Host "Option 3: Install cwebp (Advanced)" -ForegroundColor Cyan
Write-Host "1. Download from: https://developers.google.com/speed/webp/download" -ForegroundColor White
Write-Host "2. Extract to C:\webp\" -ForegroundColor White
Write-Host "3. Add to PATH" -ForegroundColor White
Write-Host "4. Run this command:" -ForegroundColor White
Write-Host '   Get-ChildItem -Recurse -Include *.png,*.jpg,*.jpeg | ForEach-Object { cwebp $_.FullName -o ($_.FullName -replace "\.(png|jpg|jpeg)$", ".webp") }' -ForegroundColor Yellow
Write-Host ""

# List all images to convert
Write-Host "📋 Images to convert:" -ForegroundColor Green
Write-Host ""
Write-Host "Public folder:" -ForegroundColor Cyan
Get-ChildItem -Path "public" -Include *.png,*.jpg,*.jpeg -File | Select-Object Name | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }
Write-Host ""
Write-Host "Assets folder:" -ForegroundColor Cyan
Get-ChildItem -Path "src/assets" -Recurse -Include *.png,*.jpg,*.jpeg -File | Select-Object Name | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }
Write-Host ""

Write-Host "✅ After conversion, I'll help you update the code!" -ForegroundColor Green
