import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface BlurRevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const BlurRevealText: React.FC<BlurRevealTextProps> = ({ text, className = '', delay = 0 }) => {
  const container = useRef<HTMLSpanElement>(null);
  
  // Split text into individual words
  const words = text.split(' ').map((word, idx) => (
    <span key={idx} className="inline-block mr-[0.25em] whitespace-nowrap">
      {word.split('').map((char, charIdx) => (
        <span key={charIdx} className="blur-char inline-block opacity-0 blur-[10px]">
          {char}
        </span>
      ))}
    </span>
  ));

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add({
      reduceMotion: "(prefers-reduced-motion: reduce)",
      allowMotion: "(prefers-reduced-motion: no-preference)"
    }, (context) => {
      let { reduceMotion } = context.conditions as any;

      if (reduceMotion) {
        gsap.set('.blur-char', { opacity: 1, filter: 'blur(0px)' });
      } else {
        gsap.to('.blur-char', {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out',
          delay: delay,
          scrollTrigger: {
            trigger: container.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
    
    return () => mm.revert();
  }, { scope: container });

  return (
    <span ref={container} className={`inline-block ${className}`}>
      {words}
    </span>
  );
};
