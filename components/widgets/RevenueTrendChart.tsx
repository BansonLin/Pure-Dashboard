"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { BUSINESS_UNITS } from "@/lib/mock/bu-data";
import { getRevenueChartData } from "@/lib/mock/revenue-data";
import { formatTwd } from "@/lib/utils";

const DATA = getRevenueChartData();

export function RevenueTrendChart() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            {BUSINESS_UNITS.map((bu) => (
              <linearGradient
                key={bu.id}
                id={`grad-${bu.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={bu.accentHex} stopOpacity={0.4} />
                <stop offset="100%" stopColor={bu.accentHex} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatTwd(Number(v))}
            width={64}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          {BUSINESS_UNITS.map((bu) => (
            <Area
              key={bu.id}
              type="monotone"
              dataKey={bu.id}
              name={bu.name}
              stackId="1"
              stroke={bu.accentHex}
              strokeWidth={1.5}
              fill={`url(#grad-${bu.id})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-2 font-semibold">{label}</p>
      <div className="space-y-1">
        {payload
          .slice()
          .reverse()
          .map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                {p.name}
              </span>
              <span className="font-medium tabular-nums">{formatTwd(p.value)}</span>
            </div>
          ))}
      </div>
      <div className="mt-2 flex justify-between border-t border-border pt-1.5 font-semibold">
        <span>合計</span>
        <span className="tabular-nums">{formatTwd(total)}</span>
      </div>
    </div>
  );
}
