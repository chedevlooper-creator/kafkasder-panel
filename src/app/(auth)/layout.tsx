import { Suspense } from "react";
import AuthLoading from "./loading";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background">
      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <Suspense fallback={<AuthLoading />}>{children}</Suspense>
      </div>
    </div>
  );
}
