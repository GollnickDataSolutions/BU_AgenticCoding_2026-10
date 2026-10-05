import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  color?: string; // hex color for label badges
  variant?: "default" | "outline";
  className?: string;
  onRemove?: () => void;
}

export function Badge({
  children,
  color,
  variant = "default",
  className,
  onRemove,
}: BadgeProps) {
  const style = color
    ? { backgroundColor: color + "26", color, borderColor: color + "40" }
    : undefined;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border",
        !color && variant === "default" && "bg-gray-100 text-gray-700 border-gray-200",
        !color && variant === "outline" && "bg-white text-gray-600 border-gray-300",
        className
      )}
      style={style}
    >
      {color && (
        <span
          className="inline-block h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:opacity-70 focus:outline-none"
          aria-label="Remove"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      )}
    </span>
  );
}
