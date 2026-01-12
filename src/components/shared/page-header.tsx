import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

export function PageHeader({
    title,
    description,
    action,
    className
}: PageHeaderProps) {
    return (
        <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between spacing-inline', className)}>
            <div>
                <h1 className="text-heading-2">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-2">{description}</p>
                )}
            </div>
            {action && (
                <div className="flex items-center spacing-inline shrink-0">
                    {action}
                </div>
            )}
        </div>
    )
}
