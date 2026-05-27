import { cn, formatTwd, formatPercent } from "@/lib/utils";
import type { PnlRow } from "@/lib/types";
import { derivePnl } from "@/lib/mock/finance-data";

interface PnlTableProps {
  rows: PnlRow[];
  /** 是否顯示合計欄 */
  showTotal?: boolean;
  className?: string;
}

export function PnlTable({ rows, showTotal = true, className }: PnlTableProps) {
  const derived = rows.map(derivePnl);
  const total = showTotal
    ? derived.reduce(
        (acc, r) => ({
          revenue: acc.revenue + r.revenue,
          cost: acc.cost + r.cost,
          opex: acc.opex + r.opex,
          grossProfit: acc.grossProfit + r.grossProfit,
          netIncome: acc.netIncome + r.netIncome,
        }),
        { revenue: 0, cost: 0, opex: 0, grossProfit: 0, netIncome: 0 },
      )
    : null;

  const totalGrossMargin =
    total && total.revenue > 0 ? total.grossProfit / total.revenue : 0;
  const totalNetMargin =
    total && total.revenue > 0 ? total.netIncome / total.revenue : 0;

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <th className="py-2 pr-4 text-left font-medium">項目</th>
            {derived.map((r) => (
              <th
                key={r.month}
                className="py-2 pl-4 text-right font-medium tabular-nums"
              >
                {r.label}
              </th>
            ))}
            {total && (
              <th className="py-2 pl-4 text-right font-semibold text-foreground">
                YTD
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <Row label="營業收入" values={derived.map((r) => r.revenue)} total={total?.revenue} />
          <Row label="營業成本" values={derived.map((r) => -r.cost)} total={total ? -total.cost : undefined} muted />
          <Row label="毛利" values={derived.map((r) => r.grossProfit)} total={total?.grossProfit} highlight />
          <RowPercent label="毛利率" values={derived.map((r) => r.grossMargin)} total={totalGrossMargin} />
          <Row label="營業費用" values={derived.map((r) => -r.opex)} total={total ? -total.opex : undefined} muted />
          <Row label="淨利" values={derived.map((r) => r.netIncome)} total={total?.netIncome} highlight bold />
          <RowPercent label="淨利率" values={derived.map((r) => r.netMargin)} total={totalNetMargin} />
        </tbody>
      </table>
    </div>
  );
}

function Row({
  label,
  values,
  total,
  muted,
  highlight,
  bold,
}: {
  label: string;
  values: number[];
  total?: number;
  muted?: boolean;
  highlight?: boolean;
  bold?: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border/60 last:border-0",
        highlight && "bg-muted/30",
      )}
    >
      <td
        className={cn(
          "py-2 pr-4 text-left",
          muted && "text-muted-foreground",
          bold && "font-semibold",
        )}
      >
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn(
            "py-2 pl-4 text-right tabular-nums",
            muted && "text-muted-foreground",
            bold && "font-semibold",
            v < 0 && !muted && "text-danger",
          )}
        >
          {formatTwd(v)}
        </td>
      ))}
      {total !== undefined && (
        <td
          className={cn(
            "py-2 pl-4 text-right tabular-nums",
            muted && "text-muted-foreground",
            bold && "font-bold",
            !muted && "font-semibold",
            total < 0 && !muted && "text-danger",
          )}
        >
          {formatTwd(total)}
        </td>
      )}
    </tr>
  );
}

function RowPercent({
  label,
  values,
  total,
}: {
  label: string;
  values: number[];
  total?: number;
}) {
  return (
    <tr className="border-b border-border/60 text-xs text-muted-foreground last:border-0">
      <td className="py-1.5 pr-4 pl-3 text-left">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-1.5 pl-4 text-right tabular-nums">
          {formatPercent(v, 1)}
        </td>
      ))}
      {total !== undefined && (
        <td className="py-1.5 pl-4 text-right font-medium tabular-nums">
          {formatPercent(total, 1)}
        </td>
      )}
    </tr>
  );
}
