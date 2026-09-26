import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const chars = '!<>-_\\\\/[]{}—=+*^?#_';

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = '', delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const container = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  const scramble = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    
    let frame = 0;
    const length = text.length;
    const duration = 40; // Total frames
    
    const update = () => {
      let output = '';
      for (let i = 0; i < length; i++) {
        // Reveal character if frame is past its threshold
        if (frame > (i / length) * duration) {
          output += text[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      setDisplayText(output);
      
      if (frame < duration) {
        frame++;
        requestAnimationFrame(update);
      } else {
        isAnimating.current = false;
      }
    };
    
    update();
  };

  useGSAP(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    // Trigger on scroll via GSAP ScrollTrigger
    ScrollTrigger.create({
      trigger: container.current,
      start: 'top 85%',
      onEnter: () => {
        setTimeout(scramble, delay * 1000);
      },
      once: true
    });
  }, { scope: container });

  return (
    <span ref={container} className={`font-mono inline-block ${className}`}>
      {displayText || text.replace(/./g, '_')}
    </span>
  );
};
