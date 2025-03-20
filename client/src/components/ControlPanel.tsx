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
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <DateSliders birthDate={birthDate} setBirthDate={setBirthDate} />
        </div>
        
        <div className="flex flex-col">
          <VisualizationToggle viewMode={viewMode} setViewMode={setViewMode} />
          <div className="mt-auto">
            <AgeStats birthDate={birthDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
