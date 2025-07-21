import { FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-primary text-primary-foreground rounded-xl p-3 w-16 h-16 inline-flex items-center justify-center shadow-lg", className)}>
      <FileCheck2 className="w-8 h-8" />
    </div>
  );
}
