export function monthRange(month: string, monthsBack = 0) {
  const [year, monthNumber] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, monthNumber - 1 - monthsBack, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  };
}

export function monthKeys(month: string, count: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, monthNumber - count + index, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}
