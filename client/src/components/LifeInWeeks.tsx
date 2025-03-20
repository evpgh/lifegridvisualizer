import { useState } from "react";
import ControlPanel from "./ControlPanel";
import LifeGrid from "./LifeGrid";

export default function LifeInWeeks() {
  // Default to average US internet user (roughly 38 years old)
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 38);
  
  const [birthDate, setBirthDate] = useState<Date>(defaultDate);
  const [viewMode, setViewMode] = useState<"weeks" | "months">("weeks");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Life in Weeks</h1>
        <p className="text-slate-600 max-w-2xl">
          Visualize your life journey from 0 to 100 years, where each block represents a period of your life.
        </p>
      </header>

      <ControlPanel 
        birthDate={birthDate} 
        setBirthDate={setBirthDate} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />
      
      <LifeGrid birthDate={birthDate} viewMode={viewMode} />
      
      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>Reflect on how you spend your time. Each block represents a period of your life journey.</p>
      </footer>
    </div>
  );
}
