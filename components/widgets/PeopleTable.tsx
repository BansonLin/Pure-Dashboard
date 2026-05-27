import { cn } from "@/lib/utils";
import { getAllPeople, tenureYears } from "@/lib/mock/org-data";
import { BU_MAP } from "@/lib/mock/bu-data";
import type { EmploymentStatus } from "@/lib/types";

const STATUS_LABEL: Record<EmploymentStatus, string> = {
  active: "在職",
  acting: "暫代",
  vacant: "空缺",
  "cross-functional": "跨部門兼職",
};

const STATUS_STYLE: Record<EmploymentStatus, string> = {
  active: "bg-muted text-muted-foreground",
  acting: "bg-warning/15 text-warning",
  vacant: "bg-danger/15 text-danger",
  "cross-functional": "bg-warning/15 text-warning",
};

export function PeopleTable() {
  const people = getAllPeople();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <th className="py-2 pr-4 text-left font-medium">姓名 / 職稱</th>
            <th className="py-2 pr-4 text-left font-medium">所屬</th>
            <th className="py-2 pr-4 text-left font-medium">職等</th>
            <th className="py-2 pr-4 text-left font-medium">任職時長</th>
            <th className="py-2 pr-4 text-left font-medium">狀態</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => {
            const tenure = tenureYears(p.joinedAt);
            const buName = p.buId ? BU_MAP[p.buId]?.name : null;
            const crossBuNames =
              p.crossBuIds?.map((id) => BU_MAP[id]?.name).filter(Boolean) ?? [];
            return (
              <tr
                key={p.id}
                className="border-b border-border/60 last:border-0 hover:bg-muted/30"
              >
                <td className="py-2.5 pr-4">
                  <p className="font-medium leading-tight">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.title}</p>
                </td>
                <td className="py-2.5 pr-4 text-xs">
                  <p>{p.department}</p>
                  {buName && (
                    <p className="text-muted-foreground">
                      {buName}
                      {crossBuNames.length > 0 &&
                        ` + ${crossBuNames.join(" / ")}`}
                    </p>
                  )}
                </td>
                <td className="py-2.5 pr-4 text-xs tabular-nums">
                  {p.grade ? `G${p.grade}` : "—"}
                </td>
                <td className="py-2.5 pr-4 text-xs tabular-nums">
                  {tenure !== null ? `${tenure.toFixed(1)} 年` : "—"}
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                      STATUS_STYLE[p.status],
                    )}
                  >
                    {STATUS_LABEL[p.status]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
