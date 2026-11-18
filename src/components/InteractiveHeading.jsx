import React, { useRef, useState, useEffect } from 'react';

export default function InteractiveHeading({ children, className = '', as: Tag = 'h2' }) {
  const ref = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleTouch = () => setIsTouch(true);
    window.addEventListener('touchstart', handleTouch, { once: true });
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mouse-x', `${x}%`);
    ref.current.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleMouseEnter = () => {
    if (isTouch || !ref.current) return;
    ref.current.style.setProperty('--hover-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--hover-opacity', '0');
  };

  return (
    <Tag
      ref={ref}
      className={`interactive-heading-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Base White Text */}
      <span style={{ color: '#fff', position: 'relative', zIndex: 1 }}>{children}</span>
      
      {/* Dynamic Gradient Overlay that follows mouse */}
      <span 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(90deg, #FF5EA8, #8B5CF6, #38BDF8)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          opacity: 'var(--hover-opacity, 0)',
          transition: 'opacity 0.3s ease-out',
          pointerEvents: 'none',
          zIndex: 2,
          // Spotlight effect revealing the gradient under the cursor
          WebkitMaskImage: 'radial-gradient(circle 120px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
          maskImage: 'radial-gradient(circle 120px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)'
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
