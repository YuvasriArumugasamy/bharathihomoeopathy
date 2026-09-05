import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component for smooth scroll animations.
 * Directions: 'up' (bottom to top), 'left' (left to right), 'right' (right to left), 'down', 'zoom', 'fade'
 */
export const ScrollReveal = ({ 
  children, 
  direction = 'up',
  delay = 0, 
  duration = 700, 
  className = '',
  threshold = 0.01,
  once = true,
  style = {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const checkViewport = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // If element is already in or near viewport
        if (rect.top <= windowHeight + 100 && rect.bottom >= -100) {
          setIsVisible(true);
          return true;
        }
      }
      return false;
    };

    // Check immediately on mount
    const alreadyVisible = checkViewport();
    if (alreadyVisible && once) return;

    // Use IntersectionObserver for scroll detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Scroll fallback event listener for instant responsiveness
    const handleScroll = () => {
      if (checkViewport() && once && currentRef) {
        observer.unobserve(currentRef);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, once]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 40px, 0)';
      case 'down':
        return 'translate3d(0, -40px, 0)';
      case 'left':
        return 'translate3d(-40px, 0, 0)';
      case 'right':
        return 'translate3d(40px, 0, 0)';
      case 'zoom':
        return 'scale(0.92)';
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
