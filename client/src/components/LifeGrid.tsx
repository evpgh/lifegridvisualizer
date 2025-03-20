import { useMemo, useEffect, useState } from "react";

interface LifeGridProps {
  birthDate: Date;
  viewMode: "weeks" | "months";
}

type BlockStatus = "past" | "current" | "future";

export default function LifeGrid({ birthDate, viewMode }: LifeGridProps) {
  const MAX_AGE = 100;
  const WEEKS_IN_YEAR = 52;
  const MONTHS_IN_YEAR = 12;
  
  // State for responsive sizing
  const [blockSize, setBlockSize] = useState(6);
  const [gridGap, setGridGap] = useState(1);
  
  // Calculate responsive sizes based on viewport
  useEffect(() => {
    function calculateSizes() {
      const isMobile = window.innerWidth < 768;
      const totalCols = viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR;
      
      // Calculate optimal block size to fit the screen
      const availableWidth = window.innerWidth * 0.9; // 90% of viewport width
      const availableHeight = window.innerHeight * 0.7; // 70% of viewport height
      
      const widthBasedSize = Math.floor(availableWidth / totalCols);
      const heightBasedSize = Math.floor(availableHeight / MAX_AGE);
      
      // Choose the smaller of the two to ensure grid fits on screen
      let newSize = Math.min(widthBasedSize, heightBasedSize);
      
      // Enforce minimum sizes
      newSize = Math.max(newSize, isMobile ? 3 : 5);
      
      // Set sizes
      setBlockSize(newSize);
      setGridGap(newSize > 5 ? 2 : 1);
    }
    
    // Calculate on mount and when viewport size changes
    calculateSizes();
    window.addEventListener('resize', calculateSizes);
    
    return () => window.removeEventListener('resize', calculateSizes);
  }, [viewMode]);
  
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

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4">
        <h2 className="text-lg font-medium mb-2 sm:mb-0">
          Your Life in {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
        </h2>
        <div className="sm:ml-4 flex items-center text-sm flex-wrap">
          <div className="flex items-center mr-4 mb-1 sm:mb-0">
            <span className="inline-block w-3 h-3 bg-[#94A3B8] mr-1"></span>
            <span>Past</span>
          </div>
          <div className="flex items-center mr-4 mb-1 sm:mb-0">
            <span className="inline-block w-3 h-3 bg-[#3B82F6] mr-1"></span>
            <span>Current</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#E2E8F0] mr-1"></span>
            <span>Future</span>
          </div>
        </div>
      </div>

      <div className="overflow-auto pb-4" style={{ maxWidth: '100%' }}>
        <div 
          style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR}, ${blockSize}px)`,
            gap: `${gridGap}px`,
            width: 'fit-content'
          }}
        >
          {gridData.flatMap((row, rowIndex) => 
            row.map((block, blockIndex) => (
              <div
                key={`${rowIndex}-${blockIndex}`}
                style={{ 
                  width: `${blockSize}px`, 
                  height: `${blockSize}px`, 
                  backgroundColor: getBlockColor(block.status)
                }}
                title={block.tooltip}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
