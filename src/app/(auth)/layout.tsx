import { Suspense } from 'react'
import AuthLoading from './loading'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Premium gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50/60" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Decorative circles - daha belirgin */}
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/20 to-cyan-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-400/15 to-teal-400/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-cyan-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

            {/* Floating particles effect */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-teal-400/30 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-40 right-32 w-3 h-3 bg-cyan-400/25 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-teal-300/30 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-20 right-1/4 w-2.5 h-2.5 bg-cyan-300/25 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }} />

            {/* Content */}
            <div className="relative z-10">
                <Suspense fallback={<AuthLoading />}>
                    {children}
                </Suspense>
            </div>
        </div>
    )
}
