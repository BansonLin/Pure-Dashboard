"use client";

import { Menu, CalendarDays, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDashboardStore } from "@/store/dashboard-store";
import { REPORT_DATE_DISPLAY } from "@/lib/report-date";

interface TopBarProps {
  title: string;
  description?: string;
}

export function TopBar({ title, description }: TopBarProps) {
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        aria-label="開啟導覽"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </h1>
        {description && (
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {description}
          </p>
        )}
      </div>

      <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
        <CalendarDays className="h-3.5 w-3.5" />
        <span className="tabular-nums">{REPORT_DATE_DISPLAY}</span>
      </div>

      <ThemeToggle />

      <form action="/api/auth/logout" method="POST">
        <Button variant="ghost" size="icon" aria-label="登出" type="submit">
          <LogOut />
        </Button>
      </form>

      <div className="hidden h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          B
        </span>
        <div className="leading-tight">
          <p className="text-xs font-medium">Banson Lin</p>
          <p className="text-[10px] text-muted-foreground">CEO</p>
        </div>
      </div>
    </header>
  );
}
