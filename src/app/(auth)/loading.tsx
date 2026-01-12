import { FormLoadingSkeleton } from '@/components/shared/loading-state'

export default function AuthLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="w-full max-w-md p-8 space-y-6">
                {/* Logo Skeleton */}
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-accent rounded-full" />
                </div>

                {/* Title Skeleton */}
                <div className="text-center space-y-2">
                    <div className="h-8 w-40 bg-accent rounded-md mx-auto" />
                    <div className="h-4 w-56 bg-accent rounded-sm mx-auto" />
                </div>

                {/* Form Card Skeleton */}
                <div className="rounded-lg border bg-card p-6">
                    <FormLoadingSkeleton fields={2} hasSubmitButton={true} />
                </div>

                {/* Demo Info Skeleton */}
                <div className="h-16 w-full bg-accent rounded-lg" />
            </div>
        </div>
    )
}
