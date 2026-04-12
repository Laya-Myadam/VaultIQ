import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "UPI",    value: 42 },
  { name: "Card",   value: 28 },
  { name: "NEFT",   value: 16 },
  { name: "ATM",    value: 10 },
  { name: "NetBkg", value: 4  },
];

const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-indigo-500 font-semibold">{payload[0].value}% of fraud</p>
      </div>
    );
  }
  return null;
};

export default function FraudChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f5f7" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}