'use client';

import { useState } from 'react';
import { CalendarDay } from './CalendarDay';
import { SweetModal } from './SweetModal';

interface Sweet {
  day: number;
  name: string;
  description: string;
  emoji: string;
}

const sweets: Sweet[] = [
  { day: 1, name: 'Gingerbread Cookie', description: 'Classic spiced cookie perfect for the holidays', emoji: '🍪' },
  { day: 2, name: 'Peppermint Candy', description: 'Sweet and refreshing minty treat', emoji: '🍭' },
  { day: 3, name: 'Chocolate Truffle', description: 'Rich and decadent chocolate delight', emoji: '🍫' },
  { day: 4, name: 'Sugar Plum', description: 'Sweet dried fruit confection', emoji: '🍇' },
  { day: 5, name: 'Candy Cane', description: 'Traditional striped peppermint stick', emoji: '🍬' },
  { day: 6, name: 'Hot Cocoa', description: 'Warm and comforting chocolate drink', emoji: '☕' },
  { day: 7, name: 'Fruitcake', description: 'Dense cake loaded with candied fruits', emoji: '🎂' },
  { day: 8, name: 'Pecan Pie', description: 'Sweet nutty pie with caramel', emoji: '🥧' },
  { day: 9, name: 'Eggnog', description: 'Creamy spiced holiday beverage', emoji: '🥛' },
  { day: 10, name: 'Cinnamon Roll', description: 'Soft roll swirled with cinnamon', emoji: '🥐' },
  { day: 11, name: 'Panettone', description: 'Italian sweet bread with candied fruit', emoji: '🍞' },
  { day: 12, name: 'Pumpkin Pie', description: 'Spiced pumpkin custard in flaky crust', emoji: '🥧' },
  { day: 13, name: 'Macarons', description: 'Delicate French sandwich cookies', emoji: '🧁' },
  { day: 14, name: 'Marzipan', description: 'Sweet almond paste confection', emoji: '🥜' },
  { day: 15, name: 'Yule Log', description: 'Chocolate sponge cake rolled with cream', emoji: '🪵' },
  { day: 16, name: 'Toffee', description: 'Buttery caramelized sugar candy', emoji: '🍬' },
  { day: 17, name: 'Stollen', description: 'German fruit bread dusted with sugar', emoji: '🥖' },
  { day: 18, name: 'Fudge', description: 'Smooth and creamy chocolate squares', emoji: '🍫' },
  { day: 19, name: 'Shortbread', description: 'Buttery crumbly Scottish cookies', emoji: '🍪' },
  { day: 20, name: 'Peppermint Bark', description: 'Layered chocolate with peppermint', emoji: '🍫' },
  { day: 21, name: 'Apple Cider', description: 'Warm spiced apple drink', emoji: '🍎' },
  { day: 22, name: 'Cranberry Tart', description: 'Tangy berry dessert in pastry', emoji: '🫐' },
  { day: 23, name: 'Caramel Popcorn', description: 'Sweet crunchy caramel coated treat', emoji: '🍿' },
  { day: 24, name: 'Sugar Cookie', description: 'Soft frosted holiday cookie', emoji: '🍪' },
  { day: 25, name: 'Christmas Joy', description: 'Merry Christmas! Enjoy all the sweet treats', emoji: '🎄' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function AdventCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [scratchedDays, setScratchedDays] = useState<Map<number, Sweet>>(new Map());

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  const handleScratchComplete = (sweet: Sweet) => {
    setScratchedDays(prev => new Map(prev).set(sweet.day, sweet));
  };

  const handleReset = (day: number) => {
    setScratchedDays(prev => {
      const newMap = new Map(prev);
      newMap.delete(day);
      return newMap;
    });
    setSelectedDay(null);
  };

  const selectedSweet = sweets.find(sweet => sweet.day === selectedDay);
  const isSelectedDayScratched = selectedDay ? scratchedDays.has(selectedDay) : false;

  // December 2025 starts on a Monday
  const calendarDays = Array(31).fill(null).map((_, i) => {
    if (i < 25) {
      return sweets[i];
    }
    return null;
  });

  return (
    <>
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-[95vw] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-rose-200/50">
          <h2 className="text-xl md:text-2xl font-semibold text-rose-900 font-christmas">December 2025</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-rose-100/80 hover:bg-rose-200/80 text-rose-900 rounded-md transition-colors text-xs font-medium font-christmas">
              Today
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-px mb-px">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center py-2 text-xs md:text-sm font-medium text-rose-700 font-christmas"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-rose-100/30 rounded-lg overflow-hidden">
          {calendarDays.map((sweet, index) => (
            <CalendarDay
              key={index}
              day={sweet ? sweet.day : index + 1}
              isScratched={sweet ? scratchedDays.has(sweet.day) : false}
              scratchedSweet={sweet ? scratchedDays.get(sweet.day) : undefined}
              onClick={sweet ? () => handleDayClick(sweet.day) : undefined}
              isAdventDay={!!sweet}
            />
          ))}
        </div>
      </div>

      {selectedSweet && (
        <SweetModal
          isOpen={selectedDay !== null}
          onClose={handleCloseModal}
          sweet={selectedSweet}
          isAlreadyScratched={isSelectedDayScratched}
          onScratchComplete={handleScratchComplete}
          onReset={handleReset}
        />
      )}
    </>
  );
}
