'use client';

import { useEffect, useState, useMemo } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Generate snowflakes once - deterministic based on index
  const snowflakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: (i * 37) % 100, // Pseudo-random but deterministic
      animationDuration: 3 + ((i * 13) % 5),
      animationDelay: (i * 0.1) % 3,
      size: 10 + ((i * 7) % 10),
    }));
  }, []);

  useEffect(() => {
    // Animate progress from 0 to 100 over 3 seconds
    const duration = 3000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Start exit animation
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 800);
        }, 200);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 bg-red-700 z-50 flex flex-col items-center justify-center transition-opacity duration-800 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Falling snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white text-xl animate-fall opacity-80"
            style={{
              left: `${flake.left}%`,
              top: '-20px',
              animationDelay: `${flake.animationDelay}s`,
              animationDuration: `${flake.animationDuration}s`,
              fontSize: `${flake.size}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="mb-12 text-center relative z-10">
        <h1 className="text-6xl font-bold text-white mb-2 font-christmas">
          Advent Calendar
        </h1>
        <p className="text-2xl text-white/90 font-christmas">
          Preparing your Christmas treats...
        </p>
      </div>

      {/* Candy Cane Progress Bar Container */}
      <div className="w-[500px] max-w-[90vw] relative z-10">
        {/* Progress percentage */}
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-white font-christmas">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar background */}
        <div className="relative h-12 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border-4 border-white/30 shadow-2xl">
          {/* Progress fill with candy cane stripes */}
          <div
            className="absolute top-0 left-0 h-full candy-cane-progress transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          >
            {/* Animated candy cane stripes */}
            <div className="absolute inset-0 candy-cane-stripes"></div>

            {/* Shine overlay */}
            <div className="absolute inset-0 bg-white/40"></div>
          </div>

          {/* Progress bar gloss */}
          <div className="absolute inset-0 bg-white/20 pointer-events-none rounded-full"></div>
        </div>

        {/* Decorative candy icons */}
        <div className="flex justify-center gap-4 mt-8 text-4xl">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍬</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎄</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🍭</span>
        </div>
      </div>
    </div>
  );
}
