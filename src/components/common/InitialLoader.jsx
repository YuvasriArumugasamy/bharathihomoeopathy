import { useEffect, useState } from 'react';
import { assets } from '../../assets';

export function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const rotateImages = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % assets.loaders.length);
    }, 350);

    const hideLoader = () => window.setTimeout(() => setVisible(false), 350);
    const timeout = document.readyState === 'complete' ? hideLoader() : null;

    window.addEventListener('load', hideLoader, { once: true });
    return () => {
      window.clearInterval(rotateImages);
      if (timeout) window.clearTimeout(timeout);
      window.removeEventListener('load', hideLoader);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="initial-loader" role="status" aria-label="Loading website">
      <img
        className="initial-loader__image"
        src={assets.loaders[imageIndex]}
        alt=""
      />
    </div>
  );
}
