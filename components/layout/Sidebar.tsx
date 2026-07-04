"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Users,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buColor } from "@/lib/ui/chart-colors";
import { useDashboardStore } from "@/store/dashboard-store";
import type { BuSeries } from "@/lib/data";

const PRIMARY_NAV = [
  { href: "/", label: "集團總覽", icon: LayoutDashboard },
  { href: "/finance", label: "財務", icon: Wallet },
  { href: "/people", label: "人力組織", icon: Users },
  { href: "/risk", label: "風險預警", icon: AlertTriangle, badgeKey: "risk" as const },
];

interface SidebarProps {
  bus: BuSeries[];
  riskTotal: number;
  riskCritical: number;
}

export function Sidebar({ bus, riskTotal, riskCritical }: SidebarProps) {
  const pathname = usePathname();
  const sidebarOpen = useDashboardStore((s) => s.sidebarOpen);
  const setSidebarOpen = useDashboardStore((s) => s.setSidebarOpen);

  // Escape 關閉行動版抽屜
  React.useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, setSidebarOpen]);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
          <span className="text-sm font-bold tracking-tight">璞</span>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">璞石集團</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Pure Group
          </p>
        </div>
        <button
          aria-label="關閉導覽"
          className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-accent lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <NavSection label="總覽">
          {PRIMARY_NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                active={active}
                onClick={() => setSidebarOpen(false)}
                badge={
                  item.badgeKey === "risk" && riskTotal > 0
                    ? {
                        text: String(riskTotal),
                        tone: riskCritical > 0 ? "danger" : "warning",
                      }
                    : undefined
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </NavSection>

        <NavSection label="事業體">
          {bus.map((bu) => {
            const active = pathname === `/bu/${bu.id}`;
            return (
              <NavLink
                key={bu.id}
                href={`/bu/${bu.id}`}
                icon={Building2}
                active={active}
                accentHex={buColor(bu.id)}
                onClick={() => setSidebarOpen(false)}
              >
                {bu.name}
              </NavLink>
            );
          })}
        </NavSection>
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted/60 p-3">
          <p className="text-xs font-medium">2026 數據打底年</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            本儀表板為 V1 Mock，待 ERP / 會計系統介接後將自動更新。
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="關閉導覽遮罩"
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-card lg:block">
        {content}
      </aside>

      {/* Mobile drawer — 關閉時以 inert + aria-hidden 移出 tab 順序與 AT tree */}
      <aside
        aria-hidden={!sidebarOpen}
        // @ts-expect-error React 18 尚未支援 inert prop，以空字串屬性寫入 DOM
        inert={sidebarOpen ? undefined : ""}
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card transition-transform lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {content}
      </aside>
    </>
  );
}

function NavSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-3">
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  accentHex?: string;
  badge?: { text: string; tone: "danger" | "warning" };
}

function NavLink({
  href,
  icon: Icon,
  active,
  children,
  onClick,
  accentHex,
  badge,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {accentHex ? (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: accentHex }}
        />
      ) : (
        <Icon className="h-4 w-4 shrink-0" />
      )}
      <span className="truncate">{children}</span>
      {badge && (
        <span
          className={cn(
            "ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
            badge.tone === "danger"
              ? "bg-danger/15 text-danger"
              : "bg-warning/15 text-warning",
          )}
        >
          {badge.text}
        </span>
      )}
    </Link>
  );
}
