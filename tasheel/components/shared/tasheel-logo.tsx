"use client";

import { useId, useMemo, type CSSProperties, type SVGProps } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type TasheelLogoProps = Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height" | "viewBox"
> & {
  size?: number;
  animated?: boolean;
  variant?: "light" | "dark";
};

export function TasheelLogo({
  size = 36,
  animated = false,
  className,
  variant = "dark",
  ...props
}: TasheelLogoProps) {
  const reactId = useId();
  const ids = useMemo(() => {
    const safe = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
    return {
      grad: `tasheel-brand-grad-${safe}`,
      glow: `tasheel-glow-${safe}`,
    };
  }, [reactId]);

  const hasAccessibleName = Boolean(
    props["aria-label"] ?? props["aria-labelledby"]
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 8 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 450, damping: 25 },
    },
  };

  const isLight = variant === "light";

  const nodes = [
    { x: 2, y: 4, w: 10, h: 8, rx: 3 },
    { x: 14, y: 4, w: 8, h: 8, rx: 3 },
    { x: 24, y: 4, w: 10, h: 8, rx: 3 },
    { x: 14, y: 14, w: 8, h: 18, rx: 3 },
  ].map((n) => ({
    ...n,
    fill: `url(#${ids.grad})`,
    stroke: isLight
      ? "rgba(79,70,229,0.5)"
      : "rgba(129,140,248,0.6)",
  }));

  const rectProps = {
    strokeWidth: 1.2,
    className: "drop-shadow-[0_4px_8px_rgba(99,102,241,0.5)]",
    style: { filter: `url(#${ids.glow})` } satisfies CSSProperties,
  };

  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      className={cn("overflow-visible shrink-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={hasAccessibleName ? undefined : true}
      {...props}
    >
      <defs>
        <linearGradient
          id={ids.grad}
          x1="0"
          y1="0"
          x2="36"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isLight ? "#4F46E5" : "#818CF8"} />
          <stop offset="0.5" stopColor={isLight ? "#2563EB" : "#3B82F6"} />
          <stop offset="1" stopColor={isLight ? "#06B6D4" : "#22D3EE"} />
        </linearGradient>

        <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur
            stdDeviation={isLight ? "2.5" : "3.5"}
            result="blur"
          />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {animated ? (
        <motion.g variants={container} initial="hidden" animate="show">
          {nodes.map((node, i) => (
            <motion.g key={i} variants={item}>
              <motion.g
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2 + 0.5,
                }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={node.rx}
                  fill={node.fill}
                  stroke={node.stroke}
                  {...rectProps}
                />
              </motion.g>
            </motion.g>
          ))}
        </motion.g>
      ) : (
        <g>
          {nodes.map((node, i) => (
            <rect
              key={i}
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx={node.rx}
              fill={node.fill}
              stroke={node.stroke}
              {...rectProps}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
