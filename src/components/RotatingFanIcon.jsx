import React, { useEffect, useRef } from 'react';

export const RotatingFanIcon = ({ children, speed = 2000 }) => {
  const iconRef = useRef(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    let animationId;
    let startTime = null;
    let rotation = 0;

    const rotate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Calculate rotation based on time and speed
      rotation = (progress / speed) * 360;
      icon.style.transform = `rotate(${rotation}deg)`;
      
      // Reset the start time to prevent overflow
      if (progress >= speed) {
        startTime = timestamp - (progress % speed);
      }
      
      animationId = requestAnimationFrame(rotate);
    };

    // Start the animation
    animationId = requestAnimationFrame(rotate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [speed]);

  return React.cloneElement(children, {
    ref: iconRef,
    className: `transition-transform duration-300 ${children.props.className || ''}`,
  });
};

export default RotatingFanIcon;
