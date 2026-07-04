import { cn } from "@/lib/utils";
import type { OrgNode } from "@/lib/data";

const FLAG_LABEL: Record<NonNullable<OrgNode["flag"]>, string> = {
  acting: "暫代未轉正",
  cross: "跨部門兼職",
  vacant: "空缺 / 編制不足",
  overloaded: "管理幅度過載",
};

const FLAG_STYLE: Record<NonNullable<OrgNode["flag"]>, string> = {
  acting:
    "border-warning ring-1 ring-warning/30 bg-warning/5",
  cross:
    "border-warning ring-1 ring-warning/30 bg-warning/5",
  vacant:
    "border-danger ring-1 ring-danger/30 bg-danger/5",
  overloaded:
    "border-danger ring-1 ring-danger/30 bg-danger/5",
};

const FLAG_DOT: Record<NonNullable<OrgNode["flag"]>, string> = {
  acting: "bg-warning",
  cross: "bg-warning",
  vacant: "bg-danger",
  overloaded: "bg-danger",
};

export function OrgChart({ tree }: { tree: OrgNode }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Legend />
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground sm:hidden">
          ← 左右滑動 →
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-fit flex-col items-center gap-6 py-2">
          <NodeBox node={tree} />
          {tree.children && <Connector />}
          {tree.children && (
            <div className="flex flex-col items-center gap-6">
              {tree.children.map((child) => (
                <SubTree key={child.id} node={child} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubTree({ node }: { node: OrgNode }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <NodeBox node={node} />
      {node.children && node.children.length > 0 && (
        <>
          <Connector />
          {node.kind === "gm" ? (
            <DeptRow nodes={node.children} />
          ) : (
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {node.children.map((c) => (
                <NodeBox key={c.id} node={c} compact />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DeptRow({ nodes }: { nodes: OrgNode[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
      {nodes.map((d) => (
        <div
          key={d.id}
          className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3"
        >
          <NodeBox node={d} />
          {d.children && d.children.length > 0 ? (
            <div className="w-full space-y-2">
              {d.children.map((p) => (
                <NodeBox key={p.id} node={p} compact />
              ))}
            </div>
          ) : (
            <div className="w-full rounded-md border border-dashed border-danger/40 bg-danger/5 px-3 py-3 text-center text-xs text-danger">
              （無在職人員）
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NodeBox({ node, compact = false }: { node: OrgNode; compact?: boolean }) {
  const isFlagged = !!node.flag;
  return (
    <div
      className={cn(
        "relative w-full max-w-[280px] rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
        compact ? "px-3 py-2" : "px-4 py-3",
        isFlagged
          ? FLAG_STYLE[node.flag!]
          : node.kind === "ceo"
            ? "border-foreground/30 bg-foreground text-background"
            : node.kind === "gm"
              ? "border-foreground/30"
              : node.kind === "dept"
                ? "border-border bg-card"
                : "border-border",
      )}
    >
      {isFlagged && (
        <span
          className={cn(
            "absolute -top-1.5 left-3 inline-flex items-center gap-1 rounded-full bg-background px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
            node.flag === "vacant" || node.flag === "overloaded"
              ? "text-danger"
              : "text-warning",
          )}
        >
          <span className={cn("h-1 w-1 rounded-full", FLAG_DOT[node.flag!])} />
          {FLAG_LABEL[node.flag!]}
        </span>
      )}
      <p className={cn("font-semibold leading-tight", compact ? "text-xs" : "text-sm")}>
        {node.label}
      </p>
      {node.sub && (
        <p
          className={cn(
            "leading-tight",
            compact ? "text-[10px]" : "text-xs",
            node.kind === "ceo" ? "text-background/70" : "text-muted-foreground",
            "mt-0.5",
          )}
        >
          {node.sub}
        </p>
      )}
      {node.meta && (
        <p
          className={cn(
            "mt-1 leading-snug",
            compact ? "text-[10px]" : "text-[11px]",
            isFlagged
              ? node.flag === "vacant" || node.flag === "overloaded"
                ? "text-danger/90"
                : "text-warning/90"
              : "text-muted-foreground",
          )}
        >
          {node.meta}
        </p>
      )}
    </div>
  );
}

function Connector() {
  return <span className="h-4 w-px bg-border" aria-hidden />;
}

function Legend() {
  const items: Array<{ flag: NonNullable<OrgNode["flag"]> }> = [
    { flag: "acting" },
    { flag: "cross" },
    { flag: "vacant" },
    { flag: "overloaded" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span>圖例：</span>
      {items.map((i) => (
        <span key={i.flag} className="inline-flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", FLAG_DOT[i.flag])} />
          {FLAG_LABEL[i.flag]}
        </span>
      ))}
    </div>
  );
}
