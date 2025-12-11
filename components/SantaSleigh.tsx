'use client';

export function SantaSleigh() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden z-10">
      {/* Snowy mountain footer */}
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 150" preserveAspectRatio="none">
        {/* Main mountain */}
        <path
          d="M0,150 L0,80 Q200,20 400,60 Q600,100 800,40 Q1000,80 1200,60 L1200,150 Z"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* Snow caps highlights */}
        <path
          d="M150,80 Q200,30 250,60 L200,60 Z"
          fill="#f0f9ff"
          opacity="0.8"
        />
        <path
          d="M550,100 Q600,50 650,80 L600,80 Z"
          fill="#f0f9ff"
          opacity="0.8"
        />
        <path
          d="M750,50 Q800,20 850,50 L800,50 Z"
          fill="#f0f9ff"
          opacity="0.8"
        />

        {/* Shadow/depth */}
        <path
          d="M0,150 L0,100 Q300,80 600,110 Q900,90 1200,100 L1200,150 Z"
          fill="#e0f2fe"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
