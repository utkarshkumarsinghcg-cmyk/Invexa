import React from 'react';

interface DotGridBackgroundProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
  children?: React.ReactNode;
}

export const DotGridBackground: React.FC<DotGridBackgroundProps> = ({
  className = '',
  dotColor = '#94a3b8',
  dotSize = 1.25,
  gap = 24,
  children
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background SVG Pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dot-pattern"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={dotSize} cy={dotSize} r={dotSize} fill={dotColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
      {children}
    </div>
  );
};
