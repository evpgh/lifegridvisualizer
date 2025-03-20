import { Card, CardContent } from "@/components/ui/card";
import { calculateAge } from "@/lib/dateUtils";

interface AgeStatsProps {
  birthDate: Date;
}

export default function AgeStats({ birthDate }: AgeStatsProps) {
  const age = calculateAge(birthDate);

  return (
    <Card className="bg-white border border-slate-200 rounded-lg">
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">Your Life Stats</h3>
        <ul className="space-y-1 text-sm">
          <li>
            Current Age: <span className="font-medium">{age.years} years, {age.months} months</span>
          </li>
          <li>
            Weeks Lived: <span className="font-medium">{age.weeksLived.toLocaleString()}</span>
          </li>
          <li>
            Months Lived: <span className="font-medium">{age.monthsTotal.toLocaleString()}</span>
          </li>
          <li>
            Percentage of Life (to 100): <span className="font-medium">{age.percentComplete}%</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
