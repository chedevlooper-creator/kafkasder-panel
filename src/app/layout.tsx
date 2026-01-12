import { AuthInitializer } from "@/components/layout/auth-initializer";
import { GlobalErrorBoundary } from "@/components/layout/global-error-boundary";
import { ProgressBar } from "@/components/layout/progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { VibeKanbanWrapper } from "@/components/layout/vibe-kanban-wrapper";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import "./globals.css";
import { WebVitals } from "./web-vitals";

export const metadata: Metadata = {
  title: {
    default: "Kafkasder Yönetim Paneli",
    template: "%s | Kafkasder",
  },
  description:
    "Kafkas Göçmenleri Derneği Yönetim Sistemi - Bağış, Üye ve Sosyal Yardım Yönetimi",
  keywords: [
    "dernek",
    "yönetim",
    "bağış",
    "sosyal yardım",
    "kafkasder",
    "üye takip",
  ],
  authors: [{ name: "Kafkasder" }],
  creator: "Kafkasder",
  publisher: "Kafkasder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Kafkasder Yönetim Paneli",
    description: "Kafkas Göçmenleri Derneği Yönetim Sistemi",
    type: "website",
    locale: "tr_TR",
  },
  robots: {
    index: false, // Dashboard sayfaları indexlenmemeli
    follow: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Ana içeriğe atla
        </a>
        <WebVitals />
        <QueryProvider>
          <GlobalErrorBoundary>
            <ProgressBar />
            <AuthInitializer />
            {children}
            <Toaster position="top-right" richColors closeButton />
            <VibeKanbanWrapper />
          </GlobalErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
