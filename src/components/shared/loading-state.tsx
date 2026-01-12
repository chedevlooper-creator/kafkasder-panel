"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { memo } from "react";

interface LoadingStateProps {
  /** Yükleme mesajı */
  message?: string;
  /** Tam sayfa yükleme mi? */
  fullPage?: boolean;
  /** Ek CSS sınıfları */
  className?: string;
  /** Spinner boyutu */
  size?: "sm" | "md" | "lg";
  /** Progress bar göster */
  showProgress?: boolean;
  /** Progress değeri (0-100) */
  progress?: number;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-8",
  lg: "size-12",
};

export function LoadingState({
  message = "Yükleniyor...",
  fullPage = false,
  className,
  size = "md",
  showProgress = false,
  progress,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullPage ? "min-h-[50vh]" : "py-12",
        className,
      )}
    >
      <Spinner className={sizeClasses[size]} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      {showProgress && (
        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      )}
    </div>
  );
}

/** Sayfa yüklenirken gösterilecek iskelet */
export const PageLoadingSkeleton = memo(function PageLoadingSkeleton({
  showHeader = true,
  showStats = true,
  showTable = true,
  statCount = 4,
}: {
  showHeader?: boolean;
  showStats?: boolean;
  showTable?: boolean;
  statCount?: number;
}) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="space-y-2">
          <Skeleton variant="text" size="xl" className="w-48" />
          <Skeleton variant="text" size="md" className="w-72" />
        </div>
      )}

      {showStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: statCount }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      )}

      {showTable && (
        <div className="space-y-2">
          <Skeleton className="h-10" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      )}
    </div>
  );
});

/** Kart yüklenirken gösterilecek iskelet */
export const CardLoadingSkeleton = memo(function CardLoadingSkeleton({
  count = 1,
  showHeader = true,
  showContent = true,
  showFooter = false,
}: {
  count?: number;
  showHeader?: boolean;
  showContent?: boolean;
  showFooter?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-card border rounded-lg space-y-3">
          {showHeader && <Skeleton variant="text" size="lg" className="w-32" />}
          {showContent && (
            <>
              <Skeleton variant="text" size="md" className="w-full" />
              <Skeleton variant="text" size="md" className="w-3/4" />
            </>
          )}
          {showFooter && (
            <Skeleton variant="text" size="sm" className="w-1/2" />
          )}
        </div>
      ))}
    </div>
  );
});

/** Tablo yüklenirken gösterilecek iskelet */
export const TableLoadingSkeleton = memo(function TableLoadingSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
}: {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}) {
  return (
    <div className="space-y-2">
      {showHeader && (
        <div className="flex gap-2">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-10 flex-1" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex gap-2">
          <Skeleton variant="circular" size="md" className="shrink-0" />
          {Array.from({ length: columns - 1 }).map((_, j) => (
            <Skeleton key={`cell-${i}-${j}`} className="h-16 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
});

/** Form yüklenirken gösterilecek iskelet */
export const FormLoadingSkeleton = memo(function FormLoadingSkeleton({
  fields = 4,
  hasSubmitButton = true,
}: {
  fields?: number;
  hasSubmitButton?: boolean;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" size="sm" className="w-24" />
          <Skeleton className="h-10" />
        </div>
      ))}
      {hasSubmitButton && <Skeleton className="h-10 w-32" />}
    </div>
  );
});

/** Grafik yüklenirken gösterilecek iskelet */
export const ChartLoadingSkeleton = memo(function ChartLoadingSkeleton({
  height = 300,
  showLegend = true,
}: {
  height?: number;
  showLegend?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full" style={{ height: `${height}px` }} />
      {showLegend && (
        <div className="flex gap-4 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton variant="circular" size="sm" />
              <Skeleton variant="text" size="sm" className="w-16" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

/** Liste yüklenirken gösterilecek iskelet */
export const ListLoadingSkeleton = memo(function ListLoadingSkeleton({
  items = 5,
  showAvatar = false,
  showBadge = false,
}: {
  items?: number;
  showAvatar?: boolean;
  showBadge?: boolean;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          {showAvatar && <Skeleton variant="circular" size="lg" />}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" size="md" className="w-48" />
            <Skeleton variant="text" size="sm" className="w-32" />
          </div>
          {showBadge && <Skeleton className="h-6 w-16" />}
        </div>
      ))}
    </div>
  );
});

/** İstatistik kartı yüklenirken gösterilecek iskelet */
export const StatCardSkeleton = memo(function StatCardSkeleton({
  showIcon = true,
  showTrend = false,
}: {
  showIcon?: boolean;
  showTrend?: boolean;
}) {
  return (
    <div className="p-6 bg-card border rounded-lg space-y-4">
      <div className="flex items-start justify-between">
        {showIcon && <Skeleton variant="circular" size="xl" />}
        {showTrend && <Skeleton className="h-6 w-20" />}
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" size="xl" className="w-24" />
        <Skeleton variant="text" size="sm" className="w-32" />
      </div>
    </div>
  );
});
