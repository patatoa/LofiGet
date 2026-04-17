import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  dayPercent: number;
  nightPercent: number;
}

const DAY_COLOR = "#F5A524";
const NIGHT_COLOR = "#7828C8";

export default function SkyDonutChart({ dayPercent, nightPercent }: Props) {
  const data = [
    { name: "Day", value: dayPercent, fill: DAY_COLOR },
    { name: "Night", value: nightPercent, fill: NIGHT_COLOR },
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          dataKey="value"
          label={({ name, value }) => `${name} ${value}%`}
          labelLine={false}
        />
        <Tooltip formatter={(v) => `${v}%`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
