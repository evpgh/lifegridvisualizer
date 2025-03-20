import { useMemo, useEffect, useState } from "react";

interface LifeGridProps {
  birthDate: Date;
  viewMode: "weeks" | "months";
}

type BlockStatus = "past" | "current" | "future";

export default function LifeGrid({ birthDate, viewMode }: LifeGridProps) {
  const MAX_AGE = 85; // Reduced from 100 to show fewer years and fit screens better
  
  // Fixed block size for consistent, button-like elements
  const FIXED_BLOCK_SIZE = 6; // Small but clickable size
  const FIXED_GRID_GAP = 1;   // Minimal gap between blocks
  
  // Standard full values
  const TOTAL_WEEKS_IN_YEAR = 52;
  const TOTAL_MONTHS_IN_YEAR = 12;
  
  // State for responsive column count - how many columns to display
  const [columnsToShow, setColumnsToShow] = useState({
    weeks: Math.floor(TOTAL_WEEKS_IN_YEAR / 2), // Default to half the weeks
    months: TOTAL_MONTHS_IN_YEAR                // Show all months by default
  });
  
  // State for the divider (how many periods to skip)
  const [periodDivider, setPeriodDivider] = useState({
    weeks: 2,  // By default show every other week (stride of 2)
    months: 1  // By default show every month (stride of 1)
  });
  
  // Calculate dynamic column count based on viewport size and fixed block size
  useEffect(() => {
    function calculateColumns() {
      // Calculate available viewport dimensions
      const viewportWidth = window.innerWidth;
      
      // We'll use a different approach - figure out how many columns will fit
      // and limit the maximum number
      
      // For better usability, increase fixed block size just a bit
      const actualBlockSize = FIXED_BLOCK_SIZE + 1; // Just a bit larger (+1px)
      const actualGapSize = FIXED_GRID_GAP;
      
      // Calculate max content width - give some margins
      const contentWidth = viewportWidth * 0.98; // Use nearly full width (98%)
      
      // Max columns that can fit - this is our adaptive approach
      const maxColumns = Math.floor(contentWidth / (actualBlockSize + actualGapSize));
      
      // For weeks view - we want to show as many columns as possible
      // but not more than 30 for UI clarity and not fewer than 12
      let weeksToShow = Math.min(maxColumns, 30); // Cap at 30 columns max
      weeksToShow = Math.max(weeksToShow, 12);    // Ensure at least 12 columns
      
      // Calculate week divider - how many weeks to skip
      // e.g., if divider is 2, we show every 2nd week
      let weekDivider = Math.ceil(TOTAL_WEEKS_IN_YEAR / weeksToShow);
      
      // Adjust the number of columns based on calculated divider
      weeksToShow = Math.ceil(TOTAL_WEEKS_IN_YEAR / weekDivider);
      
      // For months - we always want to show at least 6 columns (bi-monthly)
      // and at most 12 (monthly)
      let monthsToShow = Math.min(maxColumns, TOTAL_MONTHS_IN_YEAR);
      monthsToShow = Math.max(monthsToShow, 6); // Ensure at least 6 columns for months
      
      // Calculate month divider - how many months to skip
      let monthDivider = Math.ceil(TOTAL_MONTHS_IN_YEAR / monthsToShow);
      
      // Adjust months to show based on calculated divider
      monthsToShow = Math.ceil(TOTAL_MONTHS_IN_YEAR / monthDivider);
      
      // Update state with calculated column counts
      setColumnsToShow({
        weeks: weeksToShow,
        months: monthsToShow
      });
      
      // Update dividers (stride)
      setPeriodDivider({
        weeks: weekDivider,
        months: monthDivider
      });
    }
    
    // Calculate on mount and when viewport size changes
    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    
    return () => window.removeEventListener('resize', calculateColumns);
  }, []);
  
  // Get color based on status
  const getBlockColor = (status: BlockStatus): string => {
    switch (status) {
      case "past": return "#94A3B8";
      case "current": return "#3B82F6";
      case "future": return "#E2E8F0";
    }
  };
  
  // Generate grid data - now with proper dynamic columns
  const gridData = useMemo(() => {
    const today = new Date();
    const rows = [];
    
    // Get the number of columns and the period divider (stride) based on view mode
    const colCount = viewMode === "weeks" ? columnsToShow.weeks : columnsToShow.months;
    const divider = viewMode === "weeks" ? periodDivider.weeks : periodDivider.months;
    
    for (let year = 0; year < MAX_AGE; year++) {
      const rowBlocks = [];
      
      for (let colIndex = 0; colIndex < colCount; colIndex++) {
        // Convert column index to actual period based on the divider (stride)
        const actualPeriodIndex = colIndex * divider;
        
        // Calculate the date this block represents
        const blockDate = new Date(birthDate);
        if (viewMode === "weeks") {
          // Calculate week based on stride
          blockDate.setDate(blockDate.getDate() + year * TOTAL_WEEKS_IN_YEAR * 7 + actualPeriodIndex * 7);
        } else {
          // Calculate month based on stride
          blockDate.setMonth(blockDate.getMonth() + year * TOTAL_MONTHS_IN_YEAR + actualPeriodIndex);
        }
        
        // Determine status
        let status: BlockStatus = "future";
        if (blockDate <= today) {
          const nextPeriodDate = new Date(blockDate);
          if (viewMode === "weeks") {
            // Add one stride's worth of days
            nextPeriodDate.setDate(nextPeriodDate.getDate() + (7 * divider));
          } else {
            // Add one stride's worth of months
            nextPeriodDate.setMonth(nextPeriodDate.getMonth() + divider);
          }
          
          status = today < nextPeriodDate ? "current" : "past";
        }
        
        // Create tooltip text
        let tooltip;
        if (viewMode === "weeks") {
          // For weeks view - show actual week number
          const weekNumber = actualPeriodIndex + 1;
          tooltip = `Age: ${year} years, week ${weekNumber}`;
        } else {
          // For months view
          const monthNumber = actualPeriodIndex + 1;
          tooltip = `Age: ${year} years, month ${monthNumber}`;
        }
        
        rowBlocks.push({ status, tooltip });
      }
      
      rows.push(rowBlocks);
    }
    
    return rows;
  }, [birthDate, viewMode, columnsToShow, periodDivider]);

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

      <div className="flex justify-center pb-4 overflow-hidden">
        <div style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'hidden' // Prevent any horizontal overflow
        }}>
          <div 
            style={{ 
              display: 'grid',
              // Use the dynamic column count from our state
              gridTemplateColumns: `repeat(${viewMode === "weeks" ? columnsToShow.weeks : columnsToShow.months}, ${FIXED_BLOCK_SIZE}px)`,
              gap: `${FIXED_GRID_GAP}px`,
              maxWidth: '100%',
              margin: '0 auto' // Center the grid
            }}
          >
            {gridData.flatMap((row, rowIndex) => 
              row.map((block, blockIndex) => (
                <div
                  key={`${rowIndex}-${blockIndex}`}
                  style={{ 
                    width: `${FIXED_BLOCK_SIZE}px`, 
                    height: `${FIXED_BLOCK_SIZE}px`, 
                    backgroundColor: getBlockColor(block.status),
                    cursor: 'pointer' // Add pointer cursor for better UX
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
