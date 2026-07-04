import Link from "next/link";
import { cn } from "@/lib/utils";
import { SEVERITY_META } from "@/lib/ui/severity";
import type { RiskItem } from "@/lib/types";

interface RiskMatrixProps {
  risks: RiskItem[];
}

/**
 * 5x5 影響度 × 發生機率矩陣
 * x 軸：發生機率 1–5（左低右高）
 * y 軸：影響度 1–5（下低上高）
 */
export function RiskMatrix({ risks }: RiskMatrixProps) {
  // 將同格的點分組，避免完全重疊
  const grouped = new Map<string, RiskItem[]>();
  for (const r of risks) {
    const key = `${r.probability}-${r.impact}`;
    const arr = grouped.get(key) ?? [];
    arr.push(r);
    grouped.set(key, arr);
  }

  return (
    <div className="space-y-3">
      <div className="mx-auto flex w-full max-w-md items-stretch gap-3">
        {/* y axis label — 高度跟隨矩陣本體 */}
        <div className="flex flex-col items-center justify-center">
          <span className="rotate-180 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground [writing-mode:vertical-rl]">
            影響度 →
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="relative grid grid-cols-5 gap-0.5 rounded-lg border border-border bg-border/40 p-0.5">
            {Array.from({ length: 5 }).flatMap((_, yIdx) => {
              const impact = 5 - yIdx; // top row = highest impact
              return Array.from({ length: 5 }).map((__, xIdx) => {
                const probability = xIdx + 1;
                const cellRisks = grouped.get(`${probability}-${impact}`) ?? [];
                const tone = zoneTone(probability, impact);
                return (
                  <div
                    key={`${probability}-${impact}`}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-sm p-1",
                      tone,
                    )}
                  >
                    {cellRisks.map((r, i) => (
                      <RiskDot key={r.id} risk={r} index={i} count={cellRisks.length} />
                    ))}
                  </div>
                );
              });
            })}
          </div>

          {/* x-axis ticks */}
          <div className="grid grid-cols-5 gap-0.5 px-0.5">
            {[1, 2, 3, 4, 5].map((p) => (
              <div
                key={p}
                className="text-center text-[10px] text-muted-foreground"
              >
                {p}
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            ← 發生機率 →
          </p>
        </div>
      </div>

      <Legend />
    </div>
  );
}

function RiskDot({
  risk,
  index,
  count,
}: {
  risk: RiskItem;
  index: number;
  count: number;
}) {
  const color = SEVERITY_META[risk.severity].dot;

  // simple positioning: offset along a diagonal to avoid overlap
  const offset = count > 1 ? `translate(${(index - (count - 1) / 2) * 8}px, ${(index - (count - 1) / 2) * 4}px)` : "translate(0)";

  return (
    <Link
      href={`/risk#${risk.id}`}
      style={{ transform: offset }}
      title={`${risk.title}（影響 ${risk.impact} × 機率 ${risk.probability}）`}
      aria-label={`${risk.title}，影響度 ${risk.impact}、發生機率 ${risk.probability}，點擊查看詳情`}
      className={cn(
        "absolute flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-background transition-transform hover:scale-110",
        color,
      )}
    >
      {risk.id.replace("r-", "")}
    </Link>
  );
}

function zoneTone(probability: number, impact: number) {
  const score = probability * impact;
  if (score >= 20) return "bg-danger/30";
  if (score >= 12) return "bg-danger/15";
  if (score >= 6) return "bg-warning/15";
  return "bg-success/10";
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span>嚴重度：</span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-danger" />
        紅燈
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-warning" />
        高
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-amber-700 dark:bg-amber-400" />
        中
      </span>
      <span className="ml-auto text-[10px]">分數 = 影響度 × 機率</span>
    </div>
  );
}
