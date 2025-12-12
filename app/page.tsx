'use client';

import { useState } from 'react';
import { AdventCalendar } from '@/components/AdventCalendar';
import { SantaSleigh } from '@/components/SantaSleigh';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}

      <div className="h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-purple-50 font-christmas relative overflow-hidden">
        <main className="h-full w-full flex flex-col items-center py-8 px-4 overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-rose-800 mb-1 font-christmas">
              Advent Calendar
            </h1>
            <p className="text-base text-rose-600 font-christmas">
              Discover a holiday treat from December 1st to 25th
            </p>
          </div>

          {/* Advent Calendar */}
          <div className="flex-1 w-full flex items-center justify-center">
            <AdventCalendar />
          </div>
        </main>

        {/* Santa Sleigh Animation */}
        <SantaSleigh />
      </div>
    </>
  );
}
