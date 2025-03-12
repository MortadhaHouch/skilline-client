import { cn } from "@/lib/utils";
import { InteractiveGridPattern as InteractiveGridPatternComponent } from "../ui/interactive-grid-pattern";

export function InteractiveGridPattern({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full min-h-screen flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <InteractiveGridPatternComponent
        className={cn(
          "absolute inset-0 w-full h-full",
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "skew-y-12"
        )}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
