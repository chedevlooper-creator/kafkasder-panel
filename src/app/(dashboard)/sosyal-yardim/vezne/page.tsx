'use client'

import { Plus, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useState, useEffect } from 'react'

import { DataTable } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { QueryError } from '@/components/shared/query-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useVezneler, useVezneOzet } from '@/hooks/use-api'
import { VEZNE_DURUM_LABELS } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Vezne } from '@/types'

export default function VeznePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [vezneToEdit, setVezneToEdit] = useState<Vezne | null>(null)

  const { data, isLoading, isError, refetch } = useVezneler({ limit: 100 })
  const { data: ozet } = useVezneOzet()

  useEffect(() => {
    const handleEditVezne = (event: CustomEvent<Vezne>) => {
      setVezneToEdit(event.detail)
      setIsSheetOpen(true)
    }

    window.addEventListener('edit-vezne', handleEditVezne as EventListener)

    return () => {
      window.removeEventListener('edit-vezne', handleEditVezne as EventListener)
    }
  }, [])

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Nakdi Yardım Veznesi"
          description="Dernek veznelerini ve nakit akışını yönetin"
        />
        <QueryError
          title="Veriler Yüklenemedi"
          message="Vezne verileri yüklenirken bir hata oluştu."
          onRetry={refetch}
        />
      </div>
    )
  }

  const vezneColumns = [
    {
      accessorKey: 'kod',
      header: 'Vezne Kodu',
      cell: ({ row }: { row: { original: Vezne } }) => (
        <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
          {row.original.kod}
        </code>
      ),
    },
    {
      accessorKey: 'ad',
      header: 'Vezne Adı',
      cell: ({ row }: { row: { original: Vezne } }) => (
        <div>
          <p className="font-medium">{row.original.ad}</p>
          <p className="text-muted-foreground text-xs">{row.original.konum}</p>
        </div>
      ),
    },
    {
      accessorKey: 'sorumlu',
      header: 'Sorumlu',
      cell: ({ row }: { row: { original: Vezne } }) => (
        <div>
          <p className="text-sm">{row.original.sorumlu.name}</p>
          <p className="text-muted-foreground text-xs">{row.original.sorumlu.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'bakiyeTRY',
      header: 'Bakiye (TL)',
      cell: ({ row }: { row: { original: Vezne } }) => (
        <div>
          <p className="font-medium">{formatCurrency(row.original.bakiyeTRY, 'TRY')}</p>
          {row.original.bakiyeUSD > 0 && (
            <p className="text-muted-foreground text-xs">{formatCurrency(row.original.bakiyeUSD, 'USD')}</p>
          )}
          {row.original.bakiyeEUR > 0 && (
            <p className="text-muted-foreground text-xs">{formatCurrency(row.original.bakiyeEUR, 'EUR')}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'durum',
      header: 'Durum',
      cell: ({ row }: { row: { original: Vezne } }) => {
        const durum = row.original.durum
        const variant = durum === 'aktif' ? 'success' : durum === 'blokeli' ? 'warning' : 'secondary'
        return (
          <Badge variant={variant}>
            {VEZNE_DURUM_LABELS[durum]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'sonHareketler',
      header: 'Son Hareket',
      cell: ({ row }: { row: { original: Vezne } }) => {
        const sonHareket = row.original.sonHareketler[0]
        return sonHareket ? (
          <div>
            <p className="text-xs">{sonHareket.islem.aciklama}</p>
            <p className="text-muted-foreground text-xs">
              {formatDate(sonHareket.zaman)}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">Yok</span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nakdi Yardım Veznesi"
        description="Dernek veznelerini ve nakit akışını yönetin"
        action={
          <Button onClick={() => setIsSheetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Vezne
          </Button>
        }
      />

      {/* Summary Cards */}
      {ozet && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Vezne</CardTitle>
              <Wallet className="text-primary h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ozet.toplamVezne}</div>
              <p className="text-xs text-muted-foreground">
                {ozet.aktifVezne} aktif, {ozet.blokeliVezne} blokeli
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Bakiye (TL)</CardTitle>
              <DollarSign className="text-green-600 h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(ozet.toplamBakiyeTRY, 'TRY')}
              </div>
              <p className="text-xs text-muted-foreground">
                USD: {formatCurrency(ozet.toplamBakiyeUSD, 'USD')} |
                EUR: {formatCurrency(ozet.toplamBakiyeEUR, 'EUR')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bugün Giriş</CardTitle>
              <TrendingUp className="text-green-600 h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(ozet.bugununGiris, 'TRY')}
              </div>
              <p className="text-xs text-muted-foreground">
                {ozet.bugununIslemleri.length} işlem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bugün Çıkış</CardTitle>
              <TrendingDown className="text-red-600 h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(ozet.bugununCikis, 'TRY')}
              </div>
              <p className="text-xs text-muted-foreground">
                Net: {formatCurrency(ozet.bugununGiris - ozet.bugununCikis, 'TRY')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <DataTable
        columns={vezneColumns}
        data={data?.data || []}
        isLoading={isLoading}
        searchPlaceholder="Vezne adı veya kodu ile ara..."
        searchColumn="ad"
        filters={[
          {
            column: 'durum',
            title: 'Durum',
            options: [
              { label: 'Aktif', value: 'aktif' },
              { label: 'Blokeli', value: 'blokeli' },
              { label: 'Kapalı', value: 'kapali' },
            ],
          },
        ]}
      />

      {/* New/Edit Vezne Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{vezneToEdit ? 'Vezne Düzenle' : 'Yeni Vezne Ekle'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <p className="text-muted-foreground">
              Vezne yönetimi formu yakında eklenecek...
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
