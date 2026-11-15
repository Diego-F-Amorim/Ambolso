import { formatCurrency } from "../lib/format";
import type { DashboardData } from "../types";

interface CategoryBreakdownProps {
  items: DashboardData["expensesByCategory"];
}

export function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Nenhuma despesa neste mês.
      </p>
    );
  }

  const largest = items[0].total;

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.categoryId}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color ?? "#64748b" }}
              />
              <span className="truncate text-slate-200">{item.name}</span>
            </span>
            <span className="shrink-0 text-slate-300">
              {formatCurrency(item.total)}
              <span className="text-slate-500">
                {" "}
                · {item.percentage.toLocaleString("pt-BR")}%
              </span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-orange-600"
              style={{ width: `${(item.total / largest) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
