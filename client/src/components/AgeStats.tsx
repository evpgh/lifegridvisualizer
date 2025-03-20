import { calculateAge } from "@/lib/dateUtils";

interface AgeStatsProps {
  birthDate: Date;
}

export default function AgeStats({ birthDate }: AgeStatsProps) {
  const age = calculateAge(birthDate);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-4">Your Life Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Current Age</div>
          <div className="text-xl font-bold">{age.years}<span className="text-base font-normal"> years</span></div>
          <div className="text-sm text-slate-700">{age.months} months</div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Weeks Lived</div>
          <div className="text-xl font-bold">{age.weeksLived.toLocaleString()}</div>
          <div className="text-sm text-slate-700">weeks</div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Months Lived</div>
          <div className="text-xl font-bold">{age.monthsTotal.toLocaleString()}</div>
          <div className="text-sm text-slate-700">months</div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Life Complete</div>
          <div className="text-xl font-bold">{age.percentComplete}%</div>
          <div className="text-sm text-slate-700">of 100 years</div>
        </div>
      </div>
    </div>
  );
}
