"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  AlertCircle,
  FileText,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  Activity,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load chart component
const AidDistributionChart = dynamic(
  () => import("@/components/features/charts/aid-distribution-chart").then(mod => ({ default: mod.AidDistributionChart })),
  {
    ssr: false,
    loading: () => <div className="h-[200px] w-full animate-pulse bg-muted rounded-lg" />
  }
);

import { PageHeader } from "@/components/shared/page-header";
import { QueryError } from "@/components/shared/query-error";
import { StatCard } from "@/components/shared/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartLoadingSkeleton,
  ListLoadingSkeleton,
  StatCardSkeleton,
} from "@/components/shared/loading-state";
import { useApplications, useMembers, useDashboardStats } from "@/hooks/use-api";
import { BASVURU_DURUMU_LABELS, STATUS_VARIANTS } from "@/lib/constants";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  // Son başvurular
  const { data: applicationsData } = useApplications({
    page: 1,
    limit: 5,
    durum: "beklemede",
  });

  // Son üyeler
  const { data: membersData } = useMembers({ page: 1, limit: 5 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !stats) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Genel Bakış"
          description="Dernek istatistikleri ve son aktiviteler"
        />
        <QueryError
          title="Dashboard Yüklenemedi"
          message="İstatistikler yüklenirken bir hata oluştu."
          onRetry={refetch}
        />
      </div>
    );

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header - Simple */}
      <PageHeader
        title="Genel Bakış"
        description="Dernek istatistikleri ve son aktiviteler"
      />

      {/* Main Stats Grid - Enhanced */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Önemli İstatistikler
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Aktif Üye"
            value={stats.activeMembers.toLocaleString("tr-TR")}
            icon={Users}
            trend={12.5}
            trendLabel="geçen aya göre"
          />
          <StatCard
            label="Bekleyen Başvuru"
            value={stats.pendingApplications}
            icon={AlertCircle}
            variant="warning"
            trend={-5.2}
            trendLabel="geçen haftaya göre"
          />
          <StatCard
            label="Bu Ay Ödenen Yardım"
            value={formatCurrency(stats.monthlyAid)}
            icon={Wallet}
            trend={8.3}
            trendLabel="geçen aya göre"
          />
          <StatCard
            label="Toplam Bağış"
            value={formatCurrency(stats.totalDonations || 0)}
            icon={TrendingUp}
            variant="success"
            trend={15.7}
            trendLabel="bu yıl"
          />
        </div>
      </section>

      {/* Charts Row - Full Width */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">
          Grafikler ve Dağılımlar
        </h2>
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                Yardım Dağılımı
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Yardım türlerine göre dağılım grafiği
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/sosyal-yardim/istatistikler">
                Detaylar <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex h-auto min-h-[300px] w-full items-center justify-center aspect-[16/9] sm:aspect-[2/1] lg:min-h-[350px]">
              {isMounted &&
              !isLoading &&
              stats?.aidDistribution &&
              stats.aidDistribution.length > 0 ? (
                <AidDistributionChart data={stats.aidDistribution} />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <FileText className="h-12 w-12 opacity-30" />
                  <p>Veri bulunamadı</p>
                </div>
              )}
            </div>
            {/* Enhanced Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {stats.aidDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <div
                    className="h-3 w-3 rounded-full shadow-sm ring-2 ring-offset-2 ring-transparent group-hover:ring-primary/50 transition-all"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.value} kişi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                </div>
                Bekleyen Başvurular
              </CardTitle>
              <p className="text-muted-foreground text-xs mt-1">
                İşleme alınmayı bekleyen başvurular
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/sosyal-yardim/basvurular">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {applicationsData?.data && applicationsData.data.length > 0 ? (
                applicationsData.data.slice(0, 5).map((application) => (
                  <Link
                    key={application.id}
                    href={`/sosyal-yardim/basvurular/${application.id}`}
                    className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(
                            `${application.basvuranKisi.ad} ${application.basvuranKisi.soyad}`,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {application.basvuranKisi.ad}{" "}
                          {application.basvuranKisi.soyad}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          STATUS_VARIANTS[application.durum] as
                            | "default"
                            | "secondary"
                            | "destructive"
                            | "outline"
                            | "success"
                            | "warning"
                        }
                        className="text-xs"
                      >
                        {BASVURU_DURUMU_LABELS[application.durum]}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {formatCurrency(application.talepEdilenTutar || 0)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState
                  icon={FileText}
                  title="Bekleyen başvuru yok"
                  description="Tüm başvurular işleme alındı"
                  actionLabel="Tüm Başvuruları Gör"
                  actionHref="/sosyal-yardim/basvurular"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Members */}
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="h-3.5 w-3.5 text-primary" />
                </div>
                Son Kayıt Olan Üyeler
              </CardTitle>
              <p className="text-muted-foreground text-xs mt-1">
                Derneğe yeni katılan üyeler
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/uyeler/liste">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {membersData?.data && membersData.data.length > 0 ? (
                membersData.data.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(`${member.ad} ${member.soyad}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.ad} {member.soyad}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {member.uyeNo} • {formatDate(member.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={member.uyeTuru === "aktif" ? "success" : "outline"}
                        className="text-xs"
                      >
                        {member.uyeTuru === "aktif"
                          ? "Aktif"
                          : member.uyeTuru === "genc"
                            ? "Genç"
                            : member.uyeTuru === "onursal"
                              ? "Onursal"
                              : "Destekci"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={Users}
                  title="Henüz üye kaydı yok"
                  description="Yeni üye eklemek için başlayın"
                  actionLabel="Yeni Üye Ekle"
                  actionHref="/uyeler/yeni"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Enhanced Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <p className="font-semibold mb-1">{title}</p>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <Button variant="outline" size="sm" asChild>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

// Enhanced Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border p-8">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded-md animate-pulse" />
        </div>
      </div>

      {/* Stat Cards - 4 columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} showTrend />
        ))}
      </div>

      {/* Chart Card */}
      <ChartLoadingSkeleton height={400} showLegend />

      {/* Bottom Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListLoadingSkeleton items={5} showAvatar showBadge />
        <ListLoadingSkeleton items={5} showAvatar showBadge />
      </div>
    </div>
  );
}
