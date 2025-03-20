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
      
      // Calculate available viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Target dimensions - scale to fit screen nicely
      const targetWidth = isMobile ? viewportWidth * 0.95 : Math.min(viewportWidth * 0.85, 900);
      
      // Give more space for months view since there are fewer columns
      const sizeMultiplier = viewMode === "weeks" ? 1 : 1.5;
      
      // Calculate width-based block size
      let widthBasedSize = Math.floor((targetWidth / totalCols) * sizeMultiplier);
      
      // For height, consider visible area of the screen
      // Adjust the divisor to control how many years are visible at once
      // For mobile, we want to show about 25-30 years; for desktop about 40-50
      const visibleYears = isMobile ? 30 : 45;
      const heightBasedSize = Math.floor(viewportHeight * 0.8 / visibleYears);
      
      // Choose appropriate size based on view mode and constraints
      let newSize;
      if (viewMode === "months") {
        // For months, prioritize showing larger blocks
        newSize = Math.min(widthBasedSize, heightBasedSize * 1.2);
        newSize = Math.max(newSize, isMobile ? 8 : 12); // Minimum size for months
      } else {
        // For weeks, balance between width and height
        newSize = Math.min(widthBasedSize, heightBasedSize);
        newSize = Math.max(newSize, isMobile ? 3 : 5); // Minimum size for weeks
      }
      
      // Adjust gap based on block size and view mode
      const newGap = viewMode === "weeks" ? (newSize > 6 ? 1 : 0) : (newSize > 10 ? 2 : 1);
      
      // Update state
      setBlockSize(newSize);
      setGridGap(newGap);
    }
    
    // Calculate on mount and when viewport size changes
    calculateSizes();
    window.addEventListener('resize', calculateSizes);
    
    return () => window.removeEventListener('resize', calculateSizes);
  }, [viewMode, WEEKS_IN_YEAR, MONTHS_IN_YEAR, MAX_AGE]);
  
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

      <div className="flex justify-center pb-4">
        <div style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR}, ${blockSize}px)`,
              gap: `${gridGap}px`,
              maxWidth: '100%'
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
    </div>
  );
}
