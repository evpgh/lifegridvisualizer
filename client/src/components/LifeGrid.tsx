import { useMemo, Fragment } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LifeGridProps {
  birthDate: Date;
  viewMode: "weeks" | "months";
}

type BlockStatus = "past" | "current" | "future";

export default function LifeGrid({ birthDate, viewMode }: LifeGridProps) {
  const MAX_AGE = 100;
  const WEEKS_IN_YEAR = 52;
  const MONTHS_IN_YEAR = 12;
  
  // Calculate block status based on dates
  const calculateBlockStatus = (blockDate: Date, today: Date, viewMode: string): BlockStatus => {
    if (blockDate > today) return "future";
    
    const nextPeriodDate = new Date(blockDate);
    if (viewMode === "weeks") {
      nextPeriodDate.setDate(nextPeriodDate.getDate() + 7);
    } else {
      nextPeriodDate.setMonth(nextPeriodDate.getMonth() + 1);
    }
    
    return today >= blockDate && today < nextPeriodDate ? "current" : "past";
  };

  // Get color for block status - no hover effects
  const getBlockColor = (status: BlockStatus) => {
    switch (status) {
      case "past": return "bg-[#94A3B8]";
      case "current": return "bg-[#3B82F6]";
      case "future": return "bg-[#E2E8F0]";
    }
  };
  
  // Memoized grid generation for better performance
  const grid = useMemo(() => {
    const today = new Date();
    const rows = [];
    const periodsPerRow = viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR;
    
    for (let year = 0; year < MAX_AGE; year++) {
      const row = [];
      
      for (let period = 0; period < periodsPerRow; period++) {
        const blockDate = new Date(birthDate);
        if (viewMode === "weeks") {
          blockDate.setDate(blockDate.getDate() + year * 52 * 7 + period * 7);
        } else {
          blockDate.setMonth(blockDate.getMonth() + year * 12 + period);
        }
        
        const status = calculateBlockStatus(blockDate, today, viewMode);
        const periodLabel = viewMode === "weeks" ? "week" : "month";
        const tooltip = `Age: ${year} years, ${period + 1} ${periodLabel}s`;
        
        row.push({ status, tooltip });
      }
      
      rows.push(row);
    }
    
    return rows;
  }, [birthDate, viewMode, MAX_AGE, WEEKS_IN_YEAR, MONTHS_IN_YEAR]);

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-medium">
            Your Life in {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </h2>
          <div className="ml-4 flex items-center text-sm">
            <span className="inline-block w-3 h-3 bg-[#94A3B8] mr-1"></span>
            <span className="mr-3">Past</span>
            <span className="inline-block w-3 h-3 bg-[#3B82F6] mr-1"></span>
            <span className="mr-3">Current</span>
            <span className="inline-block w-3 h-3 bg-[#E2E8F0] mr-1"></span>
            <span>Future</span>
          </div>
        </div>

        <div 
          className="grid grid-flow-row gap-0"
          style={{ 
            gridTemplateColumns: `repeat(${viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR}, minmax(3px, 1fr))`,
            gap: "1px"
          }}
        >
          {grid.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              {row.map((block, blockIndex) => (
                <TooltipProvider key={`${rowIndex}-${blockIndex}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-2 h-2 ${getBlockColor(block.status)}`}
                        title={block.tooltip}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">{block.tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
