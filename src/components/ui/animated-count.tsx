"use client";

import { useSpring, animated } from "@react-spring/web";
import { Loader2 } from "lucide-react";

export interface NumberTickerProps {
  value: number;
  isLoading?: boolean;
  label?: string;
  className?: string;
}

export function NumberTicker({
  value,
  isLoading = false,
  label,
  className = "text-7xl font-bold tracking-tighter bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent",
}: NumberTickerProps) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        {label && (
          <p className="text-lg text-muted-foreground font-medium">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <animated.span className={className}>
        {number.to((n) => n.toFixed(0))}
      </animated.span>
      {label && (
        <p className="text-lg text-muted-foreground font-medium">{label}</p>
      )}
    </div>
  );
}
