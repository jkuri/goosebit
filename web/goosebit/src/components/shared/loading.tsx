import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type LoadingProps = {
  className?: string;
  message?: string;
};

export function Loading({
  className,
  message = "Loading, please wait",
}: LoadingProps) {
  const [dots, setDots] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <div className="flex items-center gap-1 font-medium">
        <span className="text-sm">{message}</span>
        <span className="w-6 text-left text-sm">{".".repeat(dots)}</span>
      </div>
    </div>
  );
}
