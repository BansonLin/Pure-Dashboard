import { cn } from "@/lib/utils";
import {
  PROVENANCE_LABEL,
  SCOPE_LABEL,
  TAX_LABEL,
  type Provenance,
  type RevenueScope,
  type TaxBasis,
} from "@/lib/terms";

interface SourceTagProps {
  /** 資料可信度：actual 實際 / verbal 口述待核 / mock 示意 */
  provenance: Provenance;
  /** 業績口徑（簽約/請款/收款），金額類數字才需要 */
  scope?: RevenueScope;
  /** 稅基 */
  tax?: TaxBasis;
  /** 資料截至日（YYYY-MM-DD） */
  asOf?: string;
  className?: string;
}

const TONE: Record<Provenance, string> = {
  actual: "border-success/40 bg-success/10 text-success",
  verbal: "border-warning/40 bg-warning/10 text-warning",
  mock: "border-border bg-muted text-muted-foreground",
};

/**
 * T1/T5 資料來源角標 — 每個數字必須可辨識「口徑 × 稅基 × 可信度 × 截至日」。
 * 示意數據一律灰標，Demo 時不可能被誤當真值。
 */
export function SourceTag({ provenance, scope, tax, asOf, className }: SourceTagProps) {
  const parts = [
    scope ? SCOPE_LABEL[scope] : null,
    tax ? TAX_LABEL[tax] : null,
    PROVENANCE_LABEL[provenance],
    asOf ? `截至 ${asOf.replaceAll("-", "/")}` : null,
  ].filter(Boolean);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none",
        TONE[provenance],
        className,
      )}
    >
      {parts.join(" · ")}
    </span>
  );
}
