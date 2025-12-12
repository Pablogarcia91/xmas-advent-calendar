'use client';

interface Sweet {
  day: number;
  name: string;
  description: string;
  emoji: string;
}

interface CalendarDayProps {
  day: number;
  isScratched: boolean;
  scratchedSweet?: Sweet;
  onClick?: () => void;
  isAdventDay: boolean;
}

export function CalendarDay({ day, isScratched, scratchedSweet, onClick, isAdventDay }: CalendarDayProps) {
  if (!isAdventDay) {
    return (
      <div className="bg-white/20 backdrop-blur-sm p-2 md:p-3 min-h-[70px] md:min-h-20 flex items-center justify-center border border-rose-200/30">
        <span className="text-rose-300 text-2xl md:text-3xl font-bold font-christmas">{day}</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 md:p-3 min-h-[70px] md:min-h-20 flex flex-col items-center justify-center
        transition-all duration-300 ease-out
        group
        border border-rose-200/40
        ${isScratched
          ? 'bg-green-100/50 backdrop-blur-sm'
          : 'bg-white/30 backdrop-blur-sm'
        }
        hover:bg-red-600
      `}
    >
      {isScratched && scratchedSweet ? (
        <>
          {/* Emoji preview */}
          <span className="text-3xl md:text-4xl mb-1 group-hover:scale-110 transition-transform">
            {scratchedSweet.emoji}
          </span>
          {/* Day number small */}
          <span className="text-xs md:text-sm font-bold font-christmas text-green-700 group-hover:text-white transition-colors">
            Day {day}
          </span>
        </>
      ) : (
        /* Day number - centered and large */
        <span className={`
          text-2xl md:text-4xl font-bold z-10
          font-christmas
          transition-colors duration-300
          text-rose-700
          group-hover:text-white
        `}>
          {day}
        </span>
      )}
    </button>
  );
}
