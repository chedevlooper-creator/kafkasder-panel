import { memo } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "border border-border/50 shadow-sm hover:shadow-md transition-shadow",
    success: "border-success/20 bg-success/5 shadow-sm hover:shadow-md transition-shadow",
    warning: "border-warning/20 bg-warning/5 shadow-sm hover:shadow-md transition-shadow",
    destructive: "border-destructive/20 bg-destructive/5 shadow-sm hover:shadow-md transition-shadow",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  const getTrendIcon = () => {
    if (!trend || trend === 0) return <Minus className="h-3 w-3" />;
    return trend > 0 ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const getTrendColor = () => {
    if (!trend || trend === 0) return "text-muted-foreground";
    return trend > 0 ? "text-success" : "text-destructive";
  };

  return (
    <Card
      className={cn(
        variantStyles[variant],
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
                iconStyles[variant],
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>

            {(trend !== undefined || trendLabel) && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs mt-1",
                  getTrendColor(),
                )}
              >
                {getTrendIcon()}
                <span>
                  {trend !== undefined &&
                    `${trend > 0 ? "+" : ""}${trend.toFixed(1)}%`}
                  {trendLabel && ` ${trendLabel}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
