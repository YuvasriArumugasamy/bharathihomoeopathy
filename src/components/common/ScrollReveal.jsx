import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component for smooth scroll animations.
 * Directions: 'up' (bottom to top), 'left' (left to right), 'right' (right to left), 'down', 'zoom', 'fade'
 */
export const ScrollReveal = ({ 
  children, 
  direction = 'up',
  delay = 0, 
  duration = 750, 
  className = '',
  threshold = 0.1,
  once = true,
  style = {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
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
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, once]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 50px, 0)';
      case 'down':
        return 'translate3d(0, -50px, 0)';
      case 'left':
        return 'translate3d(-50px, 0, 0)';
      case 'right':
        return 'translate3d(50px, 0, 0)';
      case 'zoom':
        return 'scale(0.9)';
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
