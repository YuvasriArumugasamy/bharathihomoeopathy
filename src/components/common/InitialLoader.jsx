import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { assets } from '../../assets';

export function InitialLoader() {
  const location = useLocation();
  const isAdmin = 
    location.pathname.toLowerCase().startsWith('/admin') ||
    (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin'));

  const [visible, setVisible] = useState(() => {
    if (isAdmin) return false;
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('bharathi_initial_loader_shown');
    }
    return true;
  });
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (isAdmin || !visible) return;

    const minimumDisplayTime = 2200;
    const startedAt = Date.now();

    const rotateImages = window.setInterval(() => {
      if (assets?.loaders?.length) {
        setImageIndex((current) => (current + 1) % assets.loaders.length);
      }
    }, 550);

    let hideTimeout;
    const hideLoader = () => {
      const remainingTime = Math.max(0, minimumDisplayTime - (Date.now() - startedAt));
      hideTimeout = window.setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem('bharathi_initial_loader_shown', 'true');
        } catch (e) {
          // ignore storage error in private browsing
        }
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
    }

    // Fallback safety timeout so the loader never gets stuck indefinitely
    const fallbackTimer = window.setTimeout(hideLoader, minimumDisplayTime + 400);

    return () => {
      window.clearInterval(rotateImages);
      window.clearTimeout(hideTimeout);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('load', hideLoader);
    };
  }, [isAdmin, visible]);

  if (isAdmin || !visible) return null;

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
