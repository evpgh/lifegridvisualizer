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
      const isMobile = window.innerWidth < 768;
      
      // Calculate available viewport dimensions
      const viewportWidth = window.innerWidth;
      const targetWidth = isMobile ? viewportWidth * 0.95 : Math.min(viewportWidth * 0.9, 800);
      
      // Calculate how many columns can fit with fixed block size
      // Include gap in calculation (FIXED_BLOCK_SIZE + FIXED_GRID_GAP)
      const columnsPerWidth = Math.floor(targetWidth / (FIXED_BLOCK_SIZE + FIXED_GRID_GAP));
      
      // For weeks view - calculate a ratio of total weeks to show
      // We want to keep a consistent divisor (4, 2, or 1) for easy understanding
      let weeksToShow = TOTAL_WEEKS_IN_YEAR; // Start with full year
      let weekDivider = 1; // Show every week
      
      if (columnsPerWidth < TOTAL_WEEKS_IN_YEAR) {
        if (columnsPerWidth >= TOTAL_WEEKS_IN_YEAR / 2) {
          // Show every other week (26 columns)
          weeksToShow = Math.floor(TOTAL_WEEKS_IN_YEAR / 2);
          weekDivider = 2;
        } else if (columnsPerWidth >= TOTAL_WEEKS_IN_YEAR / 4) {
          // Show every 4th week (13 columns)
          weeksToShow = Math.floor(TOTAL_WEEKS_IN_YEAR / 4);
          weekDivider = 4;
        } else {
          // Very small screens - show every 8th week (6-7 columns)
          weeksToShow = Math.floor(TOTAL_WEEKS_IN_YEAR / 8);
          weekDivider = 8;
        }
      }
      
      // For months - try to show all, but reduce if needed
      let monthsToShow = TOTAL_MONTHS_IN_YEAR;
      let monthDivider = 1; // Show every month
      
      if (columnsPerWidth < TOTAL_MONTHS_IN_YEAR) {
        if (columnsPerWidth >= TOTAL_MONTHS_IN_YEAR / 2) {
          // Show every other month (6 columns)
          monthsToShow = Math.floor(TOTAL_MONTHS_IN_YEAR / 2);
          monthDivider = 2;
        } else if (columnsPerWidth >= TOTAL_MONTHS_IN_YEAR / 3) {
          // Show every 3rd month (4 columns) - quarterly view
          monthsToShow = Math.floor(TOTAL_MONTHS_IN_YEAR / 3);
          monthDivider = 3;
        } else {
          // Very small screens - show every 4th month (3 columns)
          monthsToShow = Math.floor(TOTAL_MONTHS_IN_YEAR / 4);
          monthDivider = 4;
        }
      }
      
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

      <div className="flex justify-center pb-4">
        <div style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div 
            style={{ 
              display: 'grid',
              // Use the dynamic column count from our state
              gridTemplateColumns: `repeat(${viewMode === "weeks" ? columnsToShow.weeks : columnsToShow.months}, ${FIXED_BLOCK_SIZE}px)`,
              gap: `${FIXED_GRID_GAP}px`,
              maxWidth: '100%'
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
