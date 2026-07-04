"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import type { CashFlowNode } from "@/lib/types";
import { formatTwd } from "@/lib/utils";

interface CashFlowWaterfallProps {
  data: CashFlowNode[];
  className?: string;
}

interface BarDatum {
  label: string;
  // stacked: invisible spacer + visible delta
  spacer: number;
  value: number;
  type: CashFlowNode["type"];
  amount: number;
  /** running balance for tooltip */
  runningStart: number;
  runningEnd: number;
}

/** 將 cash flow node 列表轉為瀑布圖 stack 資料 */
function buildWaterfall(data: CashFlowNode[]): BarDatum[] {
  const out: BarDatum[] = [];
  let running = 0;
  for (const n of data) {
    if (n.type === "total") {
      out.push({
        label: n.label,
        spacer: 0,
        value: n.amount,
        type: "total",
        amount: n.amount,
        runningStart: 0,
        runningEnd: n.amount,
      });
      running = n.amount;
      continue;
    }
    const isIn = n.amount >= 0;
    const start = isIn ? running : running + n.amount;
    const end = isIn ? running + n.amount : running;
    out.push({
      label: n.label,
      spacer: start,
      value: end - start,
      type: n.type,
      amount: n.amount,
      runningStart: running,
      runningEnd: running + n.amount,
    });
    running += n.amount;
  }
  return out;
}

const COLOR_BY_TYPE: Record<CashFlowNode["type"], string> = {
  in: "hsl(var(--success))",
  out: "hsl(var(--danger))",
  total: "hsl(var(--foreground))",
};

export function CashFlowWaterfall({ data, className }: CashFlowWaterfallProps) {
  const bars = buildWaterfall(data);
  return (
    <div
      className={className ?? "h-[380px] w-full"}
      role="img"
      aria-label="YTD 現金流瀑布圖：期初現金經營業收現與各項支出後之期末現金"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bars} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-38}
            textAnchor="end"
            height={72}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(v) => formatTwd(Number(v))}
          />
          <Tooltip content={<WaterfallTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
          {/* invisible spacer first */}
          <Bar dataKey="spacer" stackId="wf" fill="transparent" />
          <Bar dataKey="value" stackId="wf" radius={[4, 4, 0, 0]}>
            {bars.map((b, i) => (
              <Cell key={i} fill={COLOR_BY_TYPE[b.type]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function WaterfallTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: BarDatum }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isTotal = d.type === "total";
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold">{d.label}</p>
      {isTotal ? (
        <p className="tabular-nums">餘額：{formatTwd(d.amount)}</p>
      ) : (
        <>
          <p
            className={
              d.amount >= 0
                ? "text-success tabular-nums"
                : "text-danger tabular-nums"
            }
          >
            {d.amount >= 0 ? "+" : ""}
            {formatTwd(d.amount)}
          </p>
          <p className="mt-1 text-muted-foreground tabular-nums">
            累計：{formatTwd(d.runningEnd)}
          </p>
        </>
      )}
    </div>
  );
}
