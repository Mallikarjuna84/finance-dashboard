import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function LineChartComp({ data }) {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartComp({ data }) {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="amount" nameKey="category" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
