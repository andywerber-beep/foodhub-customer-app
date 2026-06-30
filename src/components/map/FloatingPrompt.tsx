'use client';

import React, { useEffect, useState } from 'react';

interface FloatingPromptProps {
  isVisible: boolean;
  message?: string;
}

export default function FloatingPrompt({ 
  isVisible, 
  message = "✨ Special Venue Deal Nearby!" 
}: FloatingPromptProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Allow the smooth exit fade animation to finish before unmounting from the DOM
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '-20px'})`,
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        backgroundColor: '#111111',
        color: '#ffffff',
        padding: '14px 28px',
        borderRadius: '40px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}