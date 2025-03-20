import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { getMonthName, getDaysInMonth } from "@/lib/dateUtils";

interface DateSlidersProps {
  birthDate: Date;
  setBirthDate: (date: Date) => void;
}

export default function DateSliders({ birthDate, setBirthDate }: DateSlidersProps) {
  const [day, setDay] = useState<number>(birthDate.getDate());
  const [month, setMonth] = useState<number>(birthDate.getMonth() + 1); // 1-12
  const [year, setYear] = useState<number>(birthDate.getFullYear());
  const [maxDays, setMaxDays] = useState<number>(getDaysInMonth(month - 1, year));

  // Update maxDays when month or year changes
  useEffect(() => {
    const daysInMonth = getDaysInMonth(month - 1, year);
    setMaxDays(daysInMonth);
    
    // Adjust day if it exceeds the new month's max
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [month, year, day]);

  // Update birthDate when any value changes
  useEffect(() => {
    const newDate = new Date(birthDate);
    newDate.setFullYear(year);
    newDate.setMonth(month - 1);
    newDate.setDate(day);
    setBirthDate(newDate);
  }, [day, month, year, setBirthDate, birthDate]);

  // Get current year for slider max value
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Birth Date Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {/* Day Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="day-slider" className="text-base font-medium">
              Day
            </label>
            <span className="text-lg font-bold text-slate-900">{day}</span>
          </div>
          <Slider
            id="day-slider"
            min={1}
            max={maxDays}
            step={1}
            value={[day]}
            onValueChange={(value) => setDay(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>{maxDays}</span>
          </div>
        </div>
        
        {/* Month Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="month-slider" className="text-base font-medium">
              Month
            </label>
            <span className="text-lg font-bold text-slate-900">{getMonthName(month - 1)}</span>
          </div>
          <Slider
            id="month-slider"
            min={1}
            max={12}
            step={1}
            value={[month]}
            onValueChange={(value) => setMonth(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>
        
        {/* Year Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="year-slider" className="text-base font-medium">
              Year
            </label>
            <span className="text-lg font-bold text-slate-900">{year}</span>
          </div>
          <Slider
            id="year-slider"
            min={currentYear - 100}
            max={currentYear}
            step={1}
            value={[year]}
            onValueChange={(value) => setYear(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{currentYear - 100}</span>
            <span>{currentYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
