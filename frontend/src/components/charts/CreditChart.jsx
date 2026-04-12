import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Approved", value: 60 },
  { name: "Rejected", value: 20 },
  { name: "Review",   value: 20 },
];

const colors = ["#34d399", "#f87171", "#fbbf24"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
        <p className="font-medium text-gray-700">{payload[0].name}</p>
        <p className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function CreditChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}