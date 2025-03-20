import DateSliders from "./DateSliders";
import VisualizationToggle from "./VisualizationToggle";
import AgeStats from "./AgeStats";

interface ControlPanelProps {
  birthDate: Date;
  setBirthDate: (date: Date) => void;
  viewMode: "weeks" | "months";
  setViewMode: (mode: "weeks" | "months") => void;
}

export default function ControlPanel({ 
  birthDate, 
  setBirthDate, 
  viewMode, 
  setViewMode 
}: ControlPanelProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-6 mb-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium mb-4">Your Birthday</h2>
          <DateSliders birthDate={birthDate} setBirthDate={setBirthDate} />
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-4">Visualization Settings</h2>
          <VisualizationToggle viewMode={viewMode} setViewMode={setViewMode} />
          <AgeStats birthDate={birthDate} />
        </div>
      </div>
    </div>
  );
}
