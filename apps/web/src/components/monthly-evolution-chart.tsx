import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatCompactCurrency,
  formatCurrency,
  formatShortMonth,
} from "../lib/format";
import type { DashboardData } from "../types";

// Cores validadas para daltonismo contra o fundo escuro (slate-900)
const INCOME_COLOR = "#059669";
const EXPENSE_COLOR = "#ea580c";

interface MonthlyEvolutionChartProps {
  data: DashboardData["monthlyEvolution"];
}

export function MonthlyEvolutionChart({ data }: MonthlyEvolutionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatShortMonth(item.month),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={chartData}
        barGap={2}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="#1e293b" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <Tooltip
          cursor={{ fill: "#1e293b" }}
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#e2e8f0" }}
          itemStyle={{ color: "#cbd5e1" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => <span className="text-slate-300">{value}</span>}
        />
        <Bar
          dataKey="income"
          name="Receitas"
          fill={INCOME_COLOR}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="expense"
          name="Despesas"
          fill={EXPENSE_COLOR}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
