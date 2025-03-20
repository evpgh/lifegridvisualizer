import { useMemo } from "react";

interface LifeGridProps {
  birthDate: Date;
  viewMode: "weeks" | "months";
}

type BlockStatus = "past" | "current" | "future";

export default function LifeGrid({ birthDate, viewMode }: LifeGridProps) {
  const MAX_AGE = 100;
  const WEEKS_IN_YEAR = 52;
  const MONTHS_IN_YEAR = 12;
  
  // Get color based on status
  const getBlockColor = (status: BlockStatus): string => {
    switch (status) {
      case "past": return "#94A3B8";
      case "current": return "#3B82F6";
      case "future": return "#E2E8F0";
    }
  };
  
  // Generate grid data
  const gridData = useMemo(() => {
    const today = new Date();
    const rows = [];
    const periodsPerRow = viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR;
    
    for (let year = 0; year < MAX_AGE; year++) {
      const rowBlocks = [];
      
      for (let period = 0; period < periodsPerRow; period++) {
        // Calculate the date this block represents
        const blockDate = new Date(birthDate);
        if (viewMode === "weeks") {
          blockDate.setDate(blockDate.getDate() + year * 52 * 7 + period * 7);
        } else {
          blockDate.setMonth(blockDate.getMonth() + year * 12 + period);
        }
        
        // Determine status
        let status: BlockStatus = "future";
        if (blockDate <= today) {
          const nextPeriodDate = new Date(blockDate);
          if (viewMode === "weeks") {
            nextPeriodDate.setDate(nextPeriodDate.getDate() + 7);
          } else {
            nextPeriodDate.setMonth(nextPeriodDate.getMonth() + 1);
          }
          
          status = today < nextPeriodDate ? "current" : "past";
        }
        
        // Create tooltip text
        const periodLabel = viewMode === "weeks" ? "week" : "month";
        const tooltip = `Age: ${year} years, ${period + 1} ${periodLabel}s`;
        
        rowBlocks.push({ status, tooltip });
      }
      
      rows.push(rowBlocks);
    }
    
    return rows;
  }, [birthDate, viewMode]);

  // CSS for rendering the grid more efficiently
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR}, 2px)`,
    gap: '1px',
    maxWidth: '100%'
  };

  return (
    <div className="mb-6">
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

      <div style={containerStyle}>
        {gridData.flatMap((row, rowIndex) => 
          row.map((block, blockIndex) => (
            <div
              key={`${rowIndex}-${blockIndex}`}
              style={{ 
                width: '2px', 
                height: '2px', 
                backgroundColor: getBlockColor(block.status)
              }}
              title={block.tooltip}
            />
          ))
        )}
      </div>
    </div>
  );
}
