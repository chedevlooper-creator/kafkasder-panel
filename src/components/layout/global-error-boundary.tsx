'use client'

import { ErrorBoundary } from '@/components/shared/error-boundary'
import type { ReactNode } from 'react'

interface GlobalErrorBoundaryProps {
  children: ReactNode
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
