import { useEffect, useState } from 'react';
import { assets } from '../../assets';

export function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const minimumDisplayTime = 2600;
    const startedAt = Date.now();

    const rotateImages = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % assets.loaders.length);
    }, 600);

    let hideTimeout;
    const hideLoader = () => {
      const remainingTime = Math.max(0, minimumDisplayTime - (Date.now() - startedAt));
      hideTimeout = window.setTimeout(() => setVisible(false), remainingTime);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
    }

    return () => {
      window.clearInterval(rotateImages);
      window.clearTimeout(hideTimeout);
      window.removeEventListener('load', hideLoader);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="initial-loader" role="status" aria-label="Loading website">
      <img
        key={imageIndex}
        className="initial-loader__image"
        src={assets.loaders[imageIndex]}
        alt=""
      />
    </div>
  );
}
