import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PagePlaceholderProps {
  title: string;
  note?: string;
  phase?: string;
}

export function PagePlaceholder({
  title,
  note,
  phase = "階段二",
}: PagePlaceholderProps) {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Construction className="h-6 w-6" />
        </span>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {note ?? `本頁將於 ${phase} 開始建構，目前先保留路由。`}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
          {phase} 規劃中
        </span>
      </CardContent>
    </Card>
  );
}
