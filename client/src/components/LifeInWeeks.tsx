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
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Life in Blocks</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Visualize your life journey from birth to age 100, where each block represents a {viewMode === "weeks" ? "week" : "month"} of your life.
        </p>
      </header>

      <main>
        <ControlPanel 
          birthDate={birthDate} 
          setBirthDate={setBirthDate} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <LifeGrid birthDate={birthDate} viewMode={viewMode} />
        </div>
      </main>
      
      <footer className="mt-10 text-center text-sm text-slate-500 border-t border-slate-200 pt-6">
        <p>Each block represents a moment of your life. How will you spend the ones you have left?</p>
      </footer>
    </div>
  );
}
