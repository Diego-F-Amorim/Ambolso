import { formatCurrency } from "../lib/format";

interface SummaryCardProps {
  label: string;
  value: number;
  valueClass?: string;
}

export function SummaryCard({
  label,
  value,
  valueClass = "text-slate-100",
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-bold ${valueClass}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
