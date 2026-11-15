import { prisma } from "../../lib/prisma.js";
import { monthKeys, monthRange } from "../../lib/dates.js";

const EVOLUTION_MONTHS = 6;

type MonthlyRow = {
  month: string;
  type: "INCOME" | "EXPENSE";
  total: bigint;
};

export async function getDashboard(workspaceId: string, month: string) {
  const current = monthRange(month);
  const evolution = monthRange(month, EVOLUTION_MONTHS - 1);

  const [totalsByType, expensesByCategory, monthlyRows] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["type"],
      where: { workspaceId, date: { gte: current.start, lt: current.end } },
      _sum: { amount: true },
    }),

    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        workspaceId,
        type: "EXPENSE",
        date: { gte: current.start, lt: current.end },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    }),

    prisma.$queryRaw<MonthlyRow[]>`
      SELECT to_char("date", 'YYYY-MM') AS month, "type", SUM("amount") AS total
      FROM "transactions"
      WHERE "workspace_id" = ${workspaceId}
        AND "date" >= ${evolution.start}
        AND "date" < ${evolution.end}
      GROUP BY 1, 2
    `,
  ]);

  const income =
    totalsByType.find((row) => row.type === "INCOME")?._sum.amount ?? 0;
  const expense =
    totalsByType.find((row) => row.type === "EXPENSE")?._sum.amount ?? 0;

  const categories = await prisma.category.findMany({
    where: { id: { in: expensesByCategory.map((row) => row.categoryId) } },
    select: { id: true, name: true, color: true },
  });
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );

  const byCategory = expensesByCategory.map((row) => {
    const total = row._sum.amount ?? 0;
    const category = categoryById.get(row.categoryId);
    return {
      categoryId: row.categoryId,
      name: category?.name ?? "Sem categoria",
      color: category?.color ?? null,
      total,
      percentage: expense > 0 ? Math.round((total / expense) * 1000) / 10 : 0,
    };
  });

  const monthlyEvolution = monthKeys(month, EVOLUTION_MONTHS).map((key) => {
    const rowsOfMonth = monthlyRows.filter((row) => row.month === key);
    const sumOf = (type: "INCOME" | "EXPENSE") =>
      Number(rowsOfMonth.find((row) => row.type === type)?.total ?? 0);

    return { month: key, income: sumOf("INCOME"), expense: sumOf("EXPENSE") };
  });

  return {
    month,
    summary: { income, expense, balance: income - expense },
    expensesByCategory: byCategory,
    monthlyEvolution,
  };
}
