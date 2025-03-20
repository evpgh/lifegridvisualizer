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
      
      // Calculate desired grid width
      // For mobile: almost full screen width (95%)
      // For desktop: at least 500px or 50% of screen width, whichever is larger
      const targetWidth = isMobile 
        ? window.innerWidth * 0.95 
        : Math.max(500, window.innerWidth * 0.5);
      
      // Calculate block size based on target width
      let newSize = Math.floor(targetWidth / totalCols) - (isMobile ? 0.5 : 1);
      
      // Ensure blocks are visible with minimum size
      newSize = Math.max(newSize, isMobile ? 4 : 6);
      
      // Set sizes
      setBlockSize(newSize);
      setGridGap(isMobile ? 1 : 2);
    }
    
    // Calculate on mount and when viewport size changes
    calculateSizes();
    window.addEventListener('resize', calculateSizes);
    
    return () => window.removeEventListener('resize', calculateSizes);
  }, [viewMode, WEEKS_IN_YEAR, MONTHS_IN_YEAR]);
  
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
        <div className="overflow-auto" style={{ maxWidth: '100%' }}>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${viewMode === "weeks" ? WEEKS_IN_YEAR : MONTHS_IN_YEAR}, ${blockSize}px)`,
              gap: `${gridGap}px`,
              width: 'fit-content',
              margin: '0 auto'
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
