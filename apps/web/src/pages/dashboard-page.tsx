import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { currentMonth } from "../lib/format";
import { useAuth } from "../hooks/use-auth";
import { useCurrentWorkspace } from "../hooks/use-current-workspace";
import { MonthPicker } from "../components/month-picker";
import { SummaryCard } from "../components/summary-card";
import { CategoryBreakdown } from "../components/category-breakdown";
import { MonthlyEvolutionChart } from "../components/monthly-evolution-chart";
import type { DashboardData } from "../types";

export function DashboardPage() {
  const { user } = useAuth();
  const workspace = useCurrentWorkspace();
  const [month, setMonth] = useState(currentMonth);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", workspace.id, month],
    queryFn: () =>
      api<DashboardData>(
        `/workspaces/${workspace.id}/dashboard?month=${month}`,
      ),
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user?.name}! 👋</h1>
          <p className="mt-1 text-sm text-slate-400">
            Espaço: {workspace.name}
          </p>
        </div>
        <MonthPicker month={month} onChange={setMonth} />
      </div>

      {isLoading && <p className="text-slate-400">Carregando...</p>}
      {isError && <p className="text-red-400">Erro ao carregar o painel.</p>}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Receitas"
              value={data.summary.income}
              valueClass="text-emerald-400"
            />
            <SummaryCard
              label="Despesas"
              value={data.summary.expense}
              valueClass="text-orange-400"
            />
            <SummaryCard
              label="Saldo"
              value={data.summary.balance}
              valueClass={
                data.summary.balance >= 0 ? "text-slate-100" : "text-orange-400"
              }
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Gastos por categoria">
              <CategoryBreakdown items={data.expensesByCategory} />
            </Panel>
            <Panel title="Últimos 6 meses">
              <MonthlyEvolutionChart data={data.monthlyEvolution} />
            </Panel>
          </div>
        </>
      )}
    </section>
  );
}

interface PanelProps {
  title: string;
  children: ReactNode;
}

function Panel({ title, children }: PanelProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
