"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import {
  CardLoadingSkeleton,
  TableLoadingSkeleton,
} from "@/components/shared/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-media-query";
import { DataTablePagination } from "./pagination";
import { DataTableToolbar } from "./toolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuickFilterOption {
  value: string;
  label: string;
  count?: number;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  searchPlaceholder?: string;
  searchColumn?: string;
  isLoading?: boolean;
  filters?: {
    column: string;
    title: string;
    options: { label: string; value: string }[];
  }[];
  onRowClick?: (row: TData) => void;
  onExport?: (filteredData: TData[]) => void;
  mobileCardRenderer?: (row: TData) => ReactNode;
  responsiveColumns?: {
    [columnId: string]: {
      hideBelow?: "sm" | "md" | "lg";
      priority?: number;
    };
  };
  enableMobileCards?: boolean;
  quickFilter?: {
    column: string;
    options: QuickFilterOption[];
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  searchPlaceholder = "Ara...",
  searchColumn,
  isLoading = false,
  filters,
  onRowClick,
  mobileCardRenderer,
  responsiveColumns,
  enableMobileCards = true,
  quickFilter,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  // TanStack Table standard usage
  const table = useReactTable({
    data,
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: !!pageCount,
  });

  // Track window width for responsive columns with debounce
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const debouncedWindowWidth = useDebouncedValue(windowWidth, 150);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle responsive column visibility (debounced)
  useEffect(() => {
    if (!responsiveColumns) return;

    const sm = 640;
    const md = 768;
    const lg = 1024;

    Object.entries(responsiveColumns).forEach(([columnId, config]) => {
      const column = table.getColumn(columnId);
      if (!column) return;

      let shouldHide = false;
      if (config.hideBelow === "sm" && debouncedWindowWidth < sm) shouldHide = true;
      if (config.hideBelow === "md" && debouncedWindowWidth < md) shouldHide = true;
      if (config.hideBelow === "lg" && debouncedWindowWidth < lg) shouldHide = true;

      column.toggleVisibility(!shouldHide);
    });
  }, [responsiveColumns, table, debouncedWindowWidth]);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftIndicator(scrollLeft > 0);
    setShowRightIndicator(scrollLeft < scrollWidth - clientWidth);
  }, []);

  // Handle scroll indicators with passive listener
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Toolbar Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-10 w-full bg-accent rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-accent rounded-md" />
            <div className="h-10 w-10 bg-accent rounded-md" />
          </div>
        </div>

        {/* Content Skeleton */}
        {isMobile && mobileCardRenderer ? (
          <CardLoadingSkeleton count={5} />
        ) : (
          <TableLoadingSkeleton rows={5} columns={4} />
        )}

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-accent rounded-md" />
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-accent rounded-md" />
            <div className="h-8 w-8 bg-accent rounded-md" />
            <div className="h-8 w-8 bg-accent rounded-md" />
            <div className="h-8 w-8 bg-accent rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      {quickFilter && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {quickFilter.options.map((option) => {
            const column = table.getColumn(quickFilter.column);
            const isSelected = column?.getFilterValue() === option.value;

            return (
              <Button
                key={option.value}
                variant={
                  isSelected
                    ? ["success", "warning"].includes(option.variant as string)
                      ? "default"
                      : (option.variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link") || "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  column?.setFilterValue(isSelected ? undefined : option.value)
                }
                className={cn(
                  "rounded-full transition-all",
                  isSelected &&
                    "shadow-sm ring-2 ring-primary/20 ring-offset-1",
                  isSelected &&
                    option.variant === "success" &&
                    "bg-success text-success-foreground hover:bg-success/90",
                  isSelected &&
                    option.variant === "warning" &&
                    "bg-warning text-warning-foreground hover:bg-warning/90",
                )}
              >
                {option.label}
                {option.count !== undefined && (
                  <span
                    className={cn(
                      "ml-2 rounded-full px-1.5 py-0.5 text-[10px]",
                      isSelected ? "bg-background/20" : "bg-muted",
                    )}
                  >
                    {option.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}

      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        searchColumn={searchColumn}
        filters={filters}
      />

      {/* Mobile Card View */}
      {isMobile && enableMobileCards && mobileCardRenderer ? (
        <div className="flex flex-col gap-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} onClick={() => onRowClick?.(row.original)}>
                {mobileCardRenderer(row.original)}
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="py-12">
                <EmptyState variant="search" />
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="rounded-md border relative">
          {/* Scroll Indicators */}
          {showLeftIndicator && (
            <div className="scroll-indicator-left md:hidden" />
          )}
          {showRightIndicator && (
            <div className="scroll-indicator-right md:hidden" />
          )}

          <div ref={tableContainerRef} className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={onRowClick ? "cursor-pointer" : undefined}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <EmptyState variant="search" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <DataTablePagination table={table} />
    </div>
  );
}
