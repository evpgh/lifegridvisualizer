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
    <div className="space-y-4">
      {/* Day Slider */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <label htmlFor="day-slider" className="block text-sm font-medium text-slate-700">
            Day: <span>{day}</span>
          </label>
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
      </div>
      
      {/* Month Slider */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <label htmlFor="month-slider" className="block text-sm font-medium text-slate-700">
            Month: <span>{getMonthName(month - 1)}</span>
          </label>
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
      </div>
      
      {/* Year Slider */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <label htmlFor="year-slider" className="block text-sm font-medium text-slate-700">
            Year: <span>{year}</span>
          </label>
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
      </div>
    </div>
  );
}
