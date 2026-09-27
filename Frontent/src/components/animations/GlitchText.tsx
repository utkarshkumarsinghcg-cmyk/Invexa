import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <div className="glitch" data-glitch={text}>
        {text}
      </div>
    </div>
  );
};
