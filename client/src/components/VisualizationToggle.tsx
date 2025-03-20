import { Button } from "@/components/ui/button";

interface VisualizationToggleProps {
  viewMode: "weeks" | "months";
  setViewMode: (mode: "weeks" | "months") => void;
}

export default function VisualizationToggle({ viewMode, setViewMode }: VisualizationToggleProps) {
  return (
    <div className="mb-6 flex items-center">
      <h2 className="text-lg font-medium mr-4">Visualization Mode</h2>
      <div className="flex rounded-md shadow-sm" role="group">
        <Button
          variant={viewMode === "weeks" ? "default" : "outline"}
          size="default"
          className={`rounded-r-none border-r-0 min-w-[100px] ${
            viewMode === "weeks" 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "hover:bg-slate-100"
          }`}
          onClick={() => setViewMode("weeks")}
        >
          Weeks
        </Button>
        <Button
          variant={viewMode === "months" ? "default" : "outline"}
          size="default"
          className={`rounded-l-none min-w-[100px] ${
            viewMode === "months" 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "hover:bg-slate-100"
          }`}
          onClick={() => setViewMode("months")}
        >
          Months
        </Button>
      </div>
    </div>
  );
}
