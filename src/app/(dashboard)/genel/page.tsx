"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  AlertCircle,
  Clock,
  FileText,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  Wallet,
  Activity,
  Calendar,
  DollarSign,
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

  // İhtiyaç sahipleri
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
    <div className="space-y-6 animate-in">
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        
        <div className="relative">
          <PageHeader
            title="Genel Bakış"
            description="Dernek istatistikleri ve son aktiviteler"
            className="mb-0"
          />
          
          {/* Quick Stats Bar */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <QuickStat
              label="Toplam Üye"
              value={stats.activeMembers || 0}
              icon={Users}
              color="text-primary"
            />
            <QuickStat
              label="Bağış"
              value={formatCurrency(stats.totalDonations || 0)}
              icon={Activity}
              color="text-success"
            />
            <QuickStat
              label="Bekleyen"
              value={stats.pendingApplications || 0}
              icon={Clock}
              color="text-warning"
            />
            <QuickStat
              label="Bu Ay"
              value={formatCurrency(stats.monthlyAid || 0)}
              icon={DollarSign}
              color="text-primary"
            />
          </div>
        </div>
      </div>

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
        <Card className="hover-glow border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                  <Activity className="h-4 w-4 text-white" />
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
              className="hover:bg-accent"
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

      {/* Enhanced İhtiyaç Sahipleri Summary */}
      <section aria-labelledby="beneficiaries-summary">
        <Card className="hover-glow border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                  <Users className="h-4 w-4 text-white" />
                </div>
                İhtiyaç Sahipleri Özeti
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                İhtiyaç sahiplerinin durum dağılımı
              </p>
            </div>
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
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <BeneficiaryStatCard
                count={beneficiariesData?.data.filter((b) => b.durum === "aktif").length || 0}
                label="Aktif"
                icon={UserCheck}
                color="success"
                description="Şu anda yardım alan"
              />
              <BeneficiaryStatCard
                count={beneficiariesData?.data.filter((b) => b.durum === "pasif").length || 0}
                label="Pasif"
                icon={UserX}
                color="muted"
                description="Yardım almayı bekleyen"
              />
              <BeneficiaryStatCard
                count={beneficiariesData?.data.filter((b) => b.durum === "tamamlandi").length || 0}
                label="Tamamlandı"
                icon={Calendar}
                color="warning"
                description="Yardım süreci tamamlanan"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Enhanced Recent Activity Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Enhanced Recent Applications */}
        <Card className="hover-glow border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-warning to-destructive">
                  <FileText className="h-3.5 w-3.5 text-white" />
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
              className="hover:bg-accent"
            >
              <Link href="/sosyal-yardim/basvurular">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {applicationsData?.data && applicationsData.data.length > 0 ? (
                applicationsData.data.slice(0, 5).map((application, index) => (
                  <Link
                    key={application.id}
                    href={`/sosyal-yardim/basvurular/${application.id}`}
                    className="group relative overflow-hidden bg-muted/40 hover:bg-muted/60 border-border/30 hover:border-primary/30 flex items-center justify-between rounded-lg border p-3 transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-warning to-destructive opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10 ring-2 ring-warning/20 group-hover:ring-warning/40 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-warning/20 to-destructive/20 text-sm font-semibold text-warning">
                          {getInitials(
                            `${application.basvuranKisi.ad} ${application.basvuranKisi.soyad}`,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
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

        {/* Enhanced Recent Members */}
        <Card className="hover-glow border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-success to-primary">
                  <UserPlus className="h-3.5 w-3.5 text-white" />
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
              className="hover:bg-accent"
            >
              <Link href="/uyeler/liste">
                Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {membersData?.data && membersData.data.length > 0 ? (
                membersData.data.slice(0, 5).map((member, index) => (
                  <div
                    key={member.id}
                    className="group relative overflow-hidden bg-muted/40 hover:bg-muted/60 border-border/30 hover:border-success/30 flex items-center justify-between rounded-lg border p-3 transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-success to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10 ring-2 ring-success/20 group-hover:ring-success/40 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-success/20 to-primary/20 text-sm font-semibold text-success">
                          {getInitials(`${member.ad} ${member.soyad}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-success transition-colors">
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

// Quick Stat Component for Hero Section
function QuickStat({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: string | number; 
  icon: LucideIcon; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-3">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-xs">{label}</p>
      </div>
    </div>
  );
}

// Enhanced Beneficiary Stat Card
function BeneficiaryStatCard({
  count,
  label,
  icon: Icon,
  color,
  description,
}: {
  count: number;
  label: string;
  icon: LucideIcon;
  color: "success" | "muted" | "warning";
  description: string;
}) {
  const colorStyles = {
    success: "border-success/20 bg-success/5 hover:bg-success/10",
    muted: "border-muted/20 bg-muted/5 hover:bg-muted/10",
    warning: "border-warning/20 bg-warning/5 hover:bg-warning/10",
  };

  const iconColorStyles = {
    success: "text-success bg-success/20",
    muted: "text-muted-foreground bg-muted/20",
    warning: "text-warning bg-warning/20",
  };

  return (
    <div className={cn(
      "group relative overflow-hidden flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 hover:shadow-md",
      colorStyles[color]
    )}>
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
        iconColorStyles[color]
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-3xl font-bold">{count}</p>
        <p className="text-sm font-medium mt-1">{label}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-16 bg-muted rounded-md animate-pulse" />
                  <div className="h-3 w-20 bg-muted rounded-sm animate-pulse" />
                </div>
              </div>
            ))}
          </div>
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

      {/* Beneficiaries Summary */}
      <div className="p-6 bg-card border rounded-lg">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-12 w-12 bg-muted rounded-xl animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-7 w-16 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded-sm animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded-sm animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListLoadingSkeleton items={5} showAvatar showBadge />
        <ListLoadingSkeleton items={5} showAvatar showBadge />
      </div>
    </div>
  );
}
