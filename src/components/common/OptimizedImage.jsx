import React from 'react';

/**
 * Optimized Image Component with WebP support and fallback
 * Automatically serves WebP if browser supports, otherwise falls back to original format
 */
const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '', 
  loading = 'lazy',
  width,
  height,
  style = {},
  ...props 
}) => {
  // Convert extension to .webp
  const getWebPSrc = (originalSrc) => {
    if (!originalSrc || typeof originalSrc !== 'string') return originalSrc;
    return originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  };

  const webpSrc = getWebPSrc(src);
  const fallbackSrc = src;

  return (
    <picture>
      {/* WebP source for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* Fallback for browsers that don't support WebP */}
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        style={style}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
