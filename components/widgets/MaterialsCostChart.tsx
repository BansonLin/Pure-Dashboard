"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { MATERIAL_INDEX, MATERIAL_COLORS } from "@/lib/mock/finance-data";

export function MaterialsCostChart() {
  const materials = Object.keys(MATERIAL_INDEX[0].values);
  const data = MATERIAL_INDEX.map((m) => ({
    label: m.label,
    ...m.values,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
            domain={[95, 145]}
            tickFormatter={(v) => `${v}`}
            width={36}
          />
          <ReferenceLine
            y={100}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            label={{
              value: "基準 100",
              position: "insideTopRight",
              fontSize: 10,
              fill: "hsl(var(--muted-foreground))",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
              padding: "8px 10px",
            }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ padding: 0 }}
            formatter={(v) => [`${v}`, ""]}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          {materials.map((m) => (
            <Line
              key={m}
              type="monotone"
              dataKey={m}
              name={m}
              stroke={MATERIAL_COLORS[m] ?? "#666"}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
