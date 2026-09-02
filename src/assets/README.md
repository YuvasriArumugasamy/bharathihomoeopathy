# Dr. Bharathi's Homeo Care — Assets Directory

This directory contains static assets, SVG icons, logos, and placeholders used throughout the React frontend application.

## Directory Structure:
- `logo.svg` — Dr. Bharathi's Homeo Care brand vector logo
- `doctor-placeholder.svg` — Doctor avatar and medical consultation badge
- `medicine-placeholder.svg` — Homeopathic amber glass bottle and globules illustration
- `index.js` — ES module barrel export for clean React imports

## How to use custom images in your React components:

```javascript
import { assets } from '../assets';

// Use directly in JSX:
<img src={assets.logo} alt="Dr. Bharathi's Homeo Care" />
```

Or place static images in the root `/public/` directory (e.g. `/public/doctor.png`) and access them directly as `/doctor.png`.
