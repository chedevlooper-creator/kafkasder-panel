import { Suspense } from "react";
import AuthLoading from "./loading";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-teal-50/60 to-cyan-50/80" />

      {/* Animated mesh gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-tl from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-teal-300/10 via-cyan-300/10 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "12s", animationDelay: "4s" }}
      />

      {/* Subtle particles */}
      <div
        className="absolute top-20 left-[15%] w-2 h-2 bg-teal-400/40 rounded-full animate-bounce"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute top-1/3 right-[20%] w-3 h-3 bg-cyan-400/30 rounded-full animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/3 left-[25%] w-2 h-2 bg-teal-300/35 rounded-full animate-bounce"
        style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-20 right-[30%] w-2.5 h-2.5 bg-cyan-300/30 rounded-full animate-bounce"
        style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <Suspense fallback={<AuthLoading />}>{children}</Suspense>
      </div>
    </div>
  );
}
