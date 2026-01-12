"use client";

import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  Settings,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { QueryError } from "@/components/shared/query-error";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableLoadingSkeleton } from "@/components/shared/loading-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApplications } from "@/hooks/use-api";
import { AID_TYPE_LABELS, BASVURU_DURUMU_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BasvuruDurumu, SosyalYardimBasvuru, YardimTuru } from "@/types";

// Durum badge renkleri - Modern SaaS palette
const durumColors: Record<BasvuruDurumu, string> = {
  beklemede: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  inceleniyor: "bg-sky-500/15 text-sky-600 border-sky-500/25",
  onaylandi: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
  reddedildi: "bg-red-500/15 text-red-600 border-red-500/25",
  odendi: "bg-teal-500/15 text-teal-600 border-teal-500/25",
};

// Yardım türü badge renkleri - Modern SaaS palette
const yardimTuruColors: Record<YardimTuru, string> = {
  nakdi: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
  ayni: "bg-sky-500/15 text-sky-600 border-sky-500/25",
  egitim: "bg-violet-500/15 text-violet-600 border-violet-500/25",
  saglik: "bg-red-500/15 text-red-600 border-red-500/25",
  kira: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  fatura: "bg-teal-500/15 text-teal-600 border-teal-500/25",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // Filtreler
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchTc, setSearchTc] = useState("");
  const [filterDurum, setFilterDurum] = useState<string>("all");
  const [filterYardimTuru, setFilterYardimTuru] = useState<string>("all");
  const [operator, setOperator] = useState<string>("~");

  // Debounced values
  const debouncedSearchId = useDebouncedValue(searchId, 300);
  const debouncedSearchName = useDebouncedValue(searchName, 300);
  const debouncedSearchTc = useDebouncedValue(searchTc, 300);

  // Action loading states
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useApplications({
    page,
    limit: pageSize,
    durum: filterDurum !== "all" ? filterDurum : undefined,
  });

  // Memoize data array to prevent recalculation on every render
  const applications = useMemo(() => data?.data || [], [data?.data]);
  const limit = data?.pageSize || pageSize;
  const totalRecords = data?.total || 0;
  const totalPages = Math.ceil(totalRecords / limit) || 1;

  // İstatistikler - memoized (must be before any conditional returns)
  const stats = useMemo(
    () => ({
      toplam: totalRecords,
      beklemede: applications.filter(
        (a: SosyalYardimBasvuru) => a.durum === "beklemede",
      ).length,
      inceleniyor: applications.filter(
        (a: SosyalYardimBasvuru) => a.durum === "inceleniyor",
      ).length,
      onaylandi: applications.filter(
        (a: SosyalYardimBasvuru) => a.durum === "onaylandi",
      ).length,
      reddedildi: applications.filter(
        (a: SosyalYardimBasvuru) => a.durum === "reddedildi",
      ).length,
    }),
    [applications, totalRecords],
  );

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Başvurular</h1>
        <QueryError
          title="Başvurular Yüklenemedi"
          message="Başvuru listesi yüklenirken bir hata oluştu."
          onRetry={refetch}
        />
      </div>
    );
  }

  const handleSearch = () => {
    setPage(1);
  };

  // Filtreleme
  let filteredApplications = applications;
  if (filterYardimTuru !== "all") {
    filteredApplications = filteredApplications.filter(
      (a: SosyalYardimBasvuru) => a.yardimTuru === filterYardimTuru,
    );
  }
  if (debouncedSearchTc) {
    filteredApplications = filteredApplications.filter(
      (a: SosyalYardimBasvuru) =>
        a.basvuranKisi.tcKimlikNo.includes(debouncedSearchTc),
    );
  }
  if (debouncedSearchId) {
    filteredApplications = filteredApplications.filter(
      (a: SosyalYardimBasvuru) =>
        a.id.toString().includes(debouncedSearchId.toLowerCase()),
    );
  }
  if (debouncedSearchName) {
    filteredApplications = filteredApplications.filter(
      (a: SosyalYardimBasvuru) => {
        const fullName =
          `${a.basvuranKisi.ad} ${a.basvuranKisi.soyad}`.toLowerCase();
        return fullName.includes(debouncedSearchName.toLowerCase());
      },
    );
  }

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Navigasyon */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Yardım Başvuruları
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Tüm sosyal yardım başvurularını görüntüleyin ve yönetin
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-muted text-muted-foreground rounded-full px-4 py-2 text-sm font-medium">
            {totalRecords.toLocaleString("tr-TR")} Başvuru
          </span>

          {/* Sayfa Navigasyonu */}
          <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] hover:bg-background"
              aria-label="Önceki sayfa"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
              }}
              disabled={page === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="min-w-24 px-3 text-center text-sm font-medium">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] hover:bg-background"
              aria-label="Sonraki sayfa"
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px]"
              aria-label="Ayarlar"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <span className="min-w-24 px-3 text-center text-sm font-medium">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-background"
              aria-label="Sonraki sayfa"
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Ayarlar"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card className="border-2 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Toplam
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  {stats.toplam}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-2.5">
                <FileText className="text-muted-foreground h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Beklemede
                </p>
                <p className="text-3xl font-bold tracking-tight text-amber-600">
                  {stats.beklemede}
                </p>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-2.5">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  İnceleniyor
                </p>
                <p className="text-3xl font-bold tracking-tight text-sky-600">
                  {stats.inceleniyor}
                </p>
              </div>
              <div className="bg-sky-500/10 rounded-lg p-2.5">
                <AlertCircle className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Onaylandı
                </p>
                <p className="text-3xl font-bold tracking-tight text-emerald-600">
                  {stats.onaylandi}
                </p>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-2.5">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Reddedildi
                </p>
                <p className="text-3xl font-bold tracking-tight text-red-600">
                  {stats.reddedildi}
                </p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-2.5">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtreleme Alanı */}
      <Accordion type="single" collapsible defaultValue="">
        <AccordionItem value="filters" className="border-2">
          <AccordionTrigger className="px-5">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtreler</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap items-end gap-4 px-5 pb-5 pt-2">
              <div className="space-y-2">
                <label
                  htmlFor="filter-id"
                  className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
                >
                  Başvuru ID
                </label>
                <Input
                  id="filter-id"
                  placeholder="ID"
                  className="h-10 w-36"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="filter-name"
                  className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
                >
                  Başvuran Adı
                </label>
                <Input
                  id="filter-name"
                  placeholder="Ad Soyad"
                  className="h-10 w-64"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="filter-tc"
                  className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
                >
                  TC Kimlik No
                </label>
                <Input
                  id="filter-tc"
                  placeholder="TC Kimlik"
                  className="h-10 w-44"
                  value={searchTc}
                  onChange={(e) => {
                    setSearchTc(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="filter-durum"
                  className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
                >
                  Durum
                </label>
                <Select value={filterDurum} onValueChange={setFilterDurum}>
                  <SelectTrigger id="filter-durum" className="h-10 w-44">
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="beklemede">Beklemede</SelectItem>
                    <SelectItem value="inceleniyor">İnceleniyor</SelectItem>
                    <SelectItem value="onaylandi">Onaylandı</SelectItem>
                    <SelectItem value="reddedildi">Reddedildi</SelectItem>
                    <SelectItem value="odendi">Ödendi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="filter-yardim-turu"
                  className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
                >
                  Yardım Türü
                </label>
                <Select
                  value={filterYardimTuru}
                  onValueChange={setFilterYardimTuru}
                >
                  <SelectTrigger id="filter-yardim-turu" className="h-10 w-44">
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {Object.entries(AID_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="filter-operator"
                  className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
                >
                  Operatör
                </label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger id="filter-operator" className="h-10 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="=">=</SelectItem>
                    <SelectItem value=">">&gt;</SelectItem>
                    <SelectItem value="<">&lt;</SelectItem>
                    <SelectItem value="~">~</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:flex gap-2">
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Ara
                </Button>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtre
                </Button>
                <Button variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Başvuru
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  İndir
                </Button>
              </div>

              <div className="flex md:hidden gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="mr-2 h-4 w-4" />
                  Ara
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Filter className="mr-2 h-4 w-4" />
                      Filtre
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Plus className="mr-2 h-4 w-4" />
                      Yeni Başvuru
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      İndir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Veri Tablosu */}
      <div className="bg-card rounded-xl border-2 shadow-sm">
        {isLoading ? (
          <TableLoadingSkeleton rows={8} columns={8} />
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-44">Başvuran</TableHead>
                <TableHead className="w-32">Durum</TableHead>
                <TableHead className="w-40 hidden md:table-cell">
                  Yardım Türü
                </TableHead>
                <TableHead className="w-32 hidden lg:table-cell">
                  Talep Edilen
                </TableHead>
                <TableHead className="w-32 hidden lg:table-cell">
                  Başvuru Tarihi
                </TableHead>
                <TableHead className="w-32 hidden xl:table-cell">
                  Değerlendiren
                </TableHead>
                <TableHead className="w-24 hidden xl:table-cell">
                  Belgeler
                </TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-muted-foreground py-8 text-center"
                  >
                    Başvuru bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="hover:bg-muted/50 cursor-pointer transition-all duration-150 hover:shadow-sm active:scale-[0.99]"
                    onClick={() => {
                      router.push(
                        `/sosyal-yardim/basvurular/${application.id}`,
                      );
                    }}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="min-h-[44px] min-w-[44px] h-8 w-8"
                        aria-label="Başvuru detaylarını görüntüle"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/sosyal-yardim/basvurular/${application.id}`,
                          );
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {application.basvuranKisi.ad}{" "}
                          {application.basvuranKisi.soyad}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {application.basvuranKisi.tcKimlikNo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={durumColors[application.durum]}>
                        {BASVURU_DURUMU_LABELS[application.durum] ||
                          application.durum}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        className={yardimTuruColors[application.yardimTuru]}
                      >
                        {AID_TYPE_LABELS[application.yardimTuru]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="font-mono">
                        {application.talepEdilenTutar
                          ? formatCurrency(application.talepEdilenTutar)
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-muted-foreground text-sm">
                        {formatDate(application.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <span className="text-muted-foreground text-sm">
                        {application.degerlendiren?.name || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {application.belgeler.length} belge
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {application.durum === "beklemede" && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[44px] min-w-[44px] h-8 w-8 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                            aria-label="Başvuruyu onayla"
                            loading={approvingId === application.id}
                            disabled={rejectingId === application.id}
                            onClick={async (e) => {
                              e.stopPropagation();
                              setApprovingId(application.id);
                              // Simüle edilmiş async işlem
                              await new Promise((resolve) =>
                                setTimeout(resolve, 1000),
                              );
                              setApprovingId(null);
                              // Onayla işlemi
                            }}
                          >
                            {!approvingId && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[44px] min-w-[44px] h-8 w-8 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                            aria-label="Başvuruyu onayla"
                            loading={approvingId === String(application.id)}
                            disabled={rejectingId === String(application.id)}
                            onClick={async (e) => {
                              e.stopPropagation();
                              setApprovingId(String(application.id));
                              // Simüle edilmiş async işlem
                              await new Promise((resolve) =>
                                setTimeout(resolve, 1000),
                              );
                              setApprovingId(null);
                              // Onayla işlemi
                            }}
                          >
                            {approvingId !== String(application.id) && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[44px] min-w-[44px] h-8 w-8 text-red-600 hover:bg-red-500/10 hover:text-red-700"
                            aria-label="Başvuruyu reddet"
                            loading={rejectingId === String(application.id)}
                            disabled={approvingId === String(application.id)}
                            onClick={async (e) => {
                              e.stopPropagation();
                              setRejectingId(String(application.id));
                              // Simüle edilmiş async işlem
                              await new Promise((resolve) =>
                                setTimeout(resolve, 1000),
                              );
                              setRejectingId(null);
                              // Reddet işlemi
                            }}
                          >
                            {rejectingId !== String(application.id) && (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[44px] min-w-[44px] h-8 w-8 text-red-600 hover:bg-red-500/10 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Reddet işlemi
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
