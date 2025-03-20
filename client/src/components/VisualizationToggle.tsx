import { Button } from "@/components/ui/button";

interface VisualizationToggleProps {
  viewMode: "weeks" | "months";
  setViewMode: (mode: "weeks" | "months") => void;
}

export default function VisualizationToggle({ viewMode, setViewMode }: VisualizationToggleProps) {
  return (
    <div className="mb-6">
      <span className="text-sm font-medium text-slate-700 mr-3">View:</span>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <Button
          variant={viewMode === "weeks" ? "secondary" : "outline"}
          size="sm"
          className={`rounded-r-none ${viewMode === "weeks" ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700" : ""}`}
          onClick={() => setViewMode("weeks")}
        >
          Weeks
        </Button>
        <Button
          variant={viewMode === "months" ? "secondary" : "outline"}
          size="sm"
          className={`rounded-l-none ${viewMode === "months" ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700" : ""}`}
          onClick={() => setViewMode("months")}
        >
          Months
        </Button>
      </div>
    </div>
  );
}
