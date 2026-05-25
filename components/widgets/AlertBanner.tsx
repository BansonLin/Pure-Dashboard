import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  /** 紅燈數 */
  criticalCount: number;
  /** 高優先級數 */
  highCount: number;
  /** 主要訊息 */
  title?: string;
  className?: string;
  href?: string;
}

export function AlertBanner({
  criticalCount,
  highCount,
  title,
  className,
  href = "/risk",
}: AlertBannerProps) {
  if (criticalCount === 0 && highCount === 0) return null;

  const isCritical = criticalCount > 0;
  const tone = isCritical
    ? "border-danger/30 bg-danger/5 text-danger"
    : "border-warning/30 bg-warning/5 text-warning";

  const defaultTitle = isCritical
    ? `${criticalCount} 項紅燈風險未處理${highCount > 0 ? `、另有 ${highCount} 項高優先` : ""}`
    : `${highCount} 項高優先風險待處理`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between gap-4 rounded-xl border px-5 py-3 transition-colors",
        tone,
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            isCritical ? "bg-danger/10" : "bg-warning/10",
          )}
        >
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold leading-tight">
            {title ?? defaultTitle}
          </p>
          <p className="text-xs opacity-80">
            點此查看完整風險清單與建議行動
          </p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
