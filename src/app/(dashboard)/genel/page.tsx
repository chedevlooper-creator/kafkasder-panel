"use client";

import {
  ArrowRight,
  AlertCircle,
  Clock,
  FileText,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load chart component - recharts is heavy
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
import {
  useApplications,
  useBeneficiaries,
  useDashboardStats,
  useMembers,
} from "@/hooks/use-api";
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

  // İhtiyaç sahipleri - limit düşürüldü (100 -> 20)
  const { data: beneficiariesData } = useBeneficiaries({ page: 1, limit: 20 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

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
  }

  return (
    <div className="spacing-section animate-in">
      <div className="gold-accent">
        <PageHeader
          title="Genel Bakış"
          description="Dernek istatistikleri ve son aktiviteler"
        />
      </div>

      {/* Stats Grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Önemli İstatistikler
        </h2>
        <div className="grid grid-cols-1 spacing-card sm:grid-cols-2 xl:grid-cols-3">
          <div className="stagger-item order-1 sm:order-none">
            <StatCard
              label="Aktif Üye"
              value={stats.activeMembers.toLocaleString("tr-TR")}
              icon={Users}
            />
          </div>
          <div className="stagger-item order-2 sm:order-none">
            <StatCard
              label="Bekleyen Başvuru"
              value={stats.pendingApplications}
              icon={AlertCircle}
              variant="warning"
            />
          </div>
          <div className="stagger-item order-3 sm:order-none">
            <StatCard
              label="Bu Ay Ödenen Yardım"
              value={formatCurrency(stats.monthlyAid)}
              icon={Wallet}
            />
          </div>
        </div>
      </section>

      {/* Charts Row */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">
          Grafikler ve Dağılımlar
        </h2>
        <div className="grid grid-cols-1 spacing-card order-4 sm:order-none">
          {/* Aid Distribution Chart */}
          <Card className="hover-glow border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-heading-4">Yardım Dağılımı</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-accent"
              >
                <Link href="/sosyal-yardim/istatistikler">
                  Detaylar <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex h-auto min-h-[200px] w-full items-center justify-center aspect-[16/9] sm:aspect-[2/1] sm:min-h-[250px] lg:min-h-[300px]">
                {isMounted &&
                !isLoading &&
                stats?.aidDistribution &&
                stats.aidDistribution.length > 0 ? (
                  <AidDistributionChart data={stats.aidDistribution} />
                ) : (
                  <div className="text-muted-foreground">Veri yok</div>
                )}
              </div>
              {/* Legend */}
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {stats.aidDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground text-sm font-medium">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* İhtiyaç Sahipleri Özeti */}
      <section aria-labelledby="beneficiaries-summary">
        <Card className="hover-glow border-border/50 shadow-sm order-5 sm:order-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle
              id="beneficiaries-summary"
              className="flex items-center gap-2 text-heading-4"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80">
                <Users className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              İhtiyaç Sahipleri Özeti
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-accent"
            >
              <Link href="/sosyal-yardim/ihtiyac-sahipleri">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/10 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                  <UserCheck className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold text-success">
                    {beneficiariesData?.data.filter((b) => b.durum === "aktif")
                      .length || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Aktif</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-muted/20 bg-muted/10 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/20">
                  <UserX className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold text-muted-foreground">
                    {beneficiariesData?.data.filter((b) => b.durum === "pasif")
                      .length || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Pasif</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/10 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold text-warning">
                    {beneficiariesData?.data.filter(
                      (b) => b.durum === "tamamlandi",
                    ).length || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Tamamlandı</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alt Kartlar Grid */}
      <div className="grid grid-cols-1 spacing-card lg:grid-cols-2 order-6 sm:order-none">
        {/* Son Başvurular */}
        <Card className="hover-glow border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-heading-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-warning to-destructive">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Bekleyen Başvurular
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-accent"
            >
              <Link href="/sosyal-yardim/basvurular">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="spacing-compact">
              {applicationsData?.data && applicationsData.data.length > 0 ? (
                applicationsData.data.slice(0, 5).map((application, index) => (
                  <Link
                    key={application.id}
                    href={`/sosyal-yardim/basvurular/${application.id}`}
                    className="bg-muted/40 hover:bg-muted/60 border-border/30 flex items-center justify-between rounded-lg border p-3 transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={`${application.basvuranKisi.ad} ${application.basvuranKisi.soyad} başvurusunu görüntüle`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-warning/20 hover:ring-4 transition-all duration-300">
                        <AvatarFallback className="bg-linear-to-br from-warning/20 to-destructive/20 text-sm font-semibold text-warning">
                          {getInitials(
                            `${application.basvuranKisi.ad} ${application.basvuranKisi.soyad}`,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
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
                        className={cn(
                          "text-xs",
                          application.durum === "beklemede" && "animate-pulse",
                        )}
                      >
                        {BASVURU_DURUMU_LABELS[application.durum]}
                      </Badge>
                      <span className="text-primary text-sm font-semibold">
                        {formatCurrency(application.talepEdilenTutar || 0)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <FileText className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="font-medium mb-2">Bekleyen başvuru yok</p>
                  <p className="text-sm mb-4">Tüm başvurular işleme alındı</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/sosyal-yardim/basvurular">
                      Tüm Başvuruları Gör
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Son Kayıt Olan Üyeler */}
        <Card className="hover-glow border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-heading-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-success to-primary">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
              Son Kayıt Olan Üyeler
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-accent"
            >
              <Link href="/uyeler/liste">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="spacing-compact">
              {membersData?.data && membersData.data.length > 0 ? (
                membersData.data.slice(0, 5).map((member, index) => (
                  <div
                    key={member.id}
                    className="bg-muted/40 hover:bg-muted/60 border-border/30 flex items-center justify-between rounded-lg border p-3 transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.01]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-success/20 hover:ring-4 transition-all duration-300">
                        <AvatarFallback className="bg-linear-to-br from-success/20 to-primary/20 text-sm font-semibold text-success">
                          {getInitials(`${member.ad} ${member.soyad}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.ad} {member.soyad}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {member.uyeNo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {member.uyeTuru === "aktif"
                          ? "Aktif"
                          : member.uyeTuru === "genc"
                            ? "Genç"
                            : member.uyeTuru === "onursal"
                              ? "Onursal"
                              : "Destekci"}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(member.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="font-medium mb-2">Henüz üye kaydı yok</p>
                  <p className="text-sm mb-4">Yeni üye eklemek için başlayın</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/uyeler/yeni">Yeni Üye Ekle</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="spacing-section animate-in">
      {/* Header Skeleton */}
      <div className="spacing-tight">
        <div className="stagger-item">
          <div className="h-8 w-48 bg-accent rounded-md" />
          <div className="h-4 w-96 bg-accent rounded-md" />
        </div>
      </div>

      {/* Stat Cards - 3 columns matching real layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 spacing-card">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="stagger-item"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <StatCardSkeleton showTrend />
          </div>
        ))}
      </div>

      {/* Chart Card */}
      <div className="stagger-item">
        <ChartLoadingSkeleton height={400} showLegend />
      </div>

      {/* İhtiyaç Sahipleri Özeti Card */}
      <div className="stagger-item">
        <div className="p-6 bg-card border rounded-lg">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="h-8 w-8 bg-accent rounded-full" />
                <div className="space-y-2">
                  <div className="h-5 w-16 bg-accent rounded-md" />
                  <div className="h-3 w-12 bg-accent rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Cards Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 spacing-card">
        <div className="stagger-item">
          <ListLoadingSkeleton items={5} showAvatar showBadge />
        </div>
        <div className="stagger-item">
          <ListLoadingSkeleton items={5} showAvatar showBadge />
        </div>
      </div>
    </div>
  );
}
