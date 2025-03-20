export function getMonthName(monthIndex: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
}

export function getDaysInMonth(month: number, year: number): number {
  // month is 0-indexed (0-11)
  return new Date(year, month + 1, 0).getDate();
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function calculateAge(birthDate: Date) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  
  let years = today.getFullYear() - birthDateObj.getFullYear();
  let months = today.getMonth() - birthDateObj.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDateObj.getDate())) {
    years--;
    months += 12;
  }
  
  // Calculate weeks lived
  const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const weeksLived = Math.floor((today.getTime() - birthDateObj.getTime()) / weekMilliseconds);
  
  // Calculate total months
  const monthsTotal = years * 12 + months;
  
  // Calculate percentage of 100 year lifespan completed
  const percentComplete = ((years + (months / 12)) / 100 * 100).toFixed(1);
  
  return {
    years,
    months,
    weeksLived,
    monthsTotal,
    percentComplete
  };
}
