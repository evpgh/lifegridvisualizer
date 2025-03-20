import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LifeGridProps {
  birthDate: Date;
  viewMode: "weeks" | "months";
}

type BlockStatus = "past" | "current" | "future";

interface Block {
  year: number;
  period: number;
  status: BlockStatus;
  tooltip: string;
}

export default function LifeGrid({ birthDate, viewMode }: LifeGridProps) {
  const [blocks, setBlocks] = useState<Block[][]>([]);
  const MAX_AGE = 100;
  const WEEKS_IN_YEAR = 52;
  const MONTHS_IN_YEAR = 12;

  useEffect(() => {
    const today = new Date();
    const birthDateCopy = new Date(birthDate);
    const blocksPerYear = viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR;
    const newBlocks: Block[][] = [];

    // Create grid for each year (0-100)
    for (let year = 0; year < MAX_AGE; year++) {
      const yearBlocks: Block[] = [];

      // Generate blocks for each period (week or month) in this year
      for (let period = 0; period < blocksPerYear; period++) {
        // Calculate the date this block represents
        const blockDate = new Date(birthDateCopy);
        if (viewMode === "weeks") {
          blockDate.setDate(blockDate.getDate() + year * 52 * 7 + period * 7);
        } else {
          blockDate.setMonth(blockDate.getMonth() + year * 12 + period);
        }

        // Determine if this block is in the past, present, or future
        let status: BlockStatus;
        if (blockDate > today) {
          status = "future";
        } else {
          // Calculate if this is the current week/month
          const nextPeriodDate = new Date(blockDate);
          if (viewMode === "weeks") {
            nextPeriodDate.setDate(nextPeriodDate.getDate() + 7);
          } else {
            nextPeriodDate.setMonth(nextPeriodDate.getMonth() + 1);
          }

          if (today >= blockDate && today < nextPeriodDate) {
            status = "current";
          } else {
            status = "past";
          }
        }

        // Create tooltip text
        const periodLabel = viewMode === "weeks" ? "week" : "month";
        const tooltip = `Age: ${year} years, ${period + 1} ${periodLabel}s`;

        yearBlocks.push({
          year,
          period: period + 1,
          status,
          tooltip,
        });
      }

      newBlocks.push(yearBlocks);
    }

    setBlocks(newBlocks);
  }, [birthDate, viewMode]);

  const getBlockColor = (status: BlockStatus) => {
    switch (status) {
      case "past":
        return "bg-[#94A3B8] hover:bg-[#7c8ba0]";
      case "current":
        return "bg-[#3B82F6] hover:bg-[#2563eb]";
      case "future":
        return "bg-[#E2E8F0] hover:bg-[#cbd5e1]";
    }
  };

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-medium">
            Your Life in {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </h2>
          <div className="ml-4 flex items-center text-sm">
            <span className="inline-block w-3 h-3 bg-[#94A3B8] rounded-sm mr-1"></span>
            <span className="mr-3">Past</span>
            <span className="inline-block w-3 h-3 bg-[#3B82F6] rounded-sm mr-1"></span>
            <span className="mr-3">Current</span>
            <span className="inline-block w-3 h-3 bg-[#E2E8F0] rounded-sm mr-1"></span>
            <span>Future</span>
          </div>
        </div>

        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR}, minmax(8px, 1fr))` 
          }}
        >
          {blocks.map((yearBlocks, yearIndex) => (
            <div key={yearIndex} className="grid-year">
              {/* Age indicator for first column */}
              <div className="year-label text-xs text-slate-500 mb-1 sticky left-0">
                {yearIndex}
              </div>

              {/* Blocks for this year */}
              {yearBlocks.map((block, blockIndex) => (
                <TooltipProvider key={blockIndex}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm transition-colors ${getBlockColor(block.status)} transform hover:scale-125 hover:ring-1 hover:ring-slate-600`}
                        title={block.tooltip}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">{block.tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
