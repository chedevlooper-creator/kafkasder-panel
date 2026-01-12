import {
  PageLoadingSkeleton,
  TableLoadingSkeleton,
  CardLoadingSkeleton,
} from '@/components/shared/loading-state'

export default function DashboardLoading() {
  return (
    <div className="spacing-section animate-in">
      {/* Page Header Skeleton */}
      <PageLoadingSkeleton
        showHeader={true}
        showStats={true}
        showTable={true}
        statCount={4}
      />

      {/* Content Area Skeleton */}
      <CardLoadingSkeleton count={2} />

      {/* Table Skeleton */}
      <TableLoadingSkeleton rows={5} columns={4} />
    </div>
  )
}
