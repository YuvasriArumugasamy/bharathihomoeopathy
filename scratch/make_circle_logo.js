import fs from 'fs';
import path from 'path';

const logoPath = path.resolve('public/logo.jpeg');
const logoBuffer = fs.readFileSync(logoPath);
const base64Logo = logoBuffer.toString('base64');
const dataUri = `data:image/jpeg;base64,${base64Logo}`;

// Create circular SVG with base64 embedded image and circle clipPath
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <clipPath id="circleClip">
      <circle cx="250" cy="250" r="248" />
    </clipPath>
  </defs>
  <!-- Background circle fill to avoid subtle edge gaps -->
  <circle cx="250" cy="250" r="248" fill="#1e536b" />
  <!-- Clipped image inside circle -->
  <image href="${dataUri}" x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" />
  <!-- Subtle circular border for clean high-res finish -->
  <circle cx="250" cy="250" r="247" fill="none" stroke="#ea580c" stroke-width="3" opacity="0.6" />
</svg>
`;

fs.writeFileSync(path.resolve('public/favicon.svg'), svgContent);
fs.writeFileSync(path.resolve('public/logo-circle.svg'), svgContent);
console.log('Successfully created circular SVG favicons!');
