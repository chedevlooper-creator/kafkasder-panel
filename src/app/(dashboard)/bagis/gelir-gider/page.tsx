'use client'

import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

import { gelirGiderColumns } from '@/components/features/donations/gelir-gider-columns'
import { GelirGiderForm } from '@/components/features/donations/gelir-gider-form'
import { DataTable } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { QueryError } from '@/components/shared/query-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useGelirGider, useGelirGiderOzet } from '@/hooks/use-api'
import { formatCurrency } from '@/lib/utils'
import type { GelirGider } from '@/types'

export default function GelirGiderPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [islemToEdit, setIslemToEdit] = useState<GelirGider | null>(null)

  const { data, isLoading, isError, refetch } = useGelirGider({ pageSize: 1000 })
  const { data: ozet } = useGelirGiderOzet()

  useEffect(() => {
    const handleEditGelirGider = (event: CustomEvent<GelirGider>) => {
      setIslemToEdit(event.detail)
      setIsSheetOpen(true)
    }

    window.addEventListener('edit-gelir-gider', handleEditGelirGider as EventListener)

    return () => {
      window.removeEventListener('edit-gelir-gider', handleEditGelirGider as EventListener)
    }
  }, [])

  const handleCloseSheet = () => {
    setIslemToEdit(null)
    setIsSheetOpen(false)
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gelir-Gider Takibi"
          description="Dernek gelirlerini ve giderlerini görüntüleyin ve yönetin"
        />
        <QueryError
          title="Veriler Yüklenemedi"
          message="Gelir-gider verileri yüklenirken bir hata oluştu."
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gelir-Gider Takibi"
        description="Dernek gelirlerini ve giderlerini görüntüleyin ve yönetin"
        action={
          <Button onClick={() => setIsSheetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni İşlem
          </Button>
        }
      />

      {/* Summary Cards */}
      {ozet && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
              <TrendingUp className="text-green-600 h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(ozet.toplamGelir, 'TRY')}
              </div>
              <p className="text-xs text-muted-foreground">
                Bu ay: {formatCurrency(ozet.aylikGelir, 'TRY')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gider</CardTitle>
              <TrendingDown className="text-red-600 h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(ozet.toplamGider, 'TRY')}
              </div>
              <p className="text-xs text-muted-foreground">
                Bu ay: {formatCurrency(ozet.aylikGider, 'TRY')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Bakiye</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${ozet.netBakiye >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(ozet.netBakiye, 'TRY')}
              </div>
              <p className="text-xs text-muted-foreground">
                {ozet.netBakiye >= 0 ? 'Gelir fazlası' : 'Gider fazlası'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Ay Net</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(ozet.aylikGelir - ozet.aylikGider) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(ozet.aylikGelir - ozet.aylikGider, 'TRY')}
              </div>
              <p className="text-xs text-muted-foreground">
                Aylık fark
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <DataTable
        columns={gelirGiderColumns}
        data={data?.data || []}
        isLoading={isLoading}
        searchPlaceholder="Açıklama ile ara..."
        searchColumn="aciklama"
        filters={[
          {
            column: 'islemTuru',
            title: 'İşlem Türü',
            options: [
              { label: 'Gelir', value: 'gelir' },
              { label: 'Gider', value: 'gider' },
            ],
          },
        ]}
      />

      {/* New/Edit Operation Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{islemToEdit ? 'İşlem Düzenle' : 'Yeni İşlem Ekle'}</SheetTitle>
          </SheetHeader>
          <GelirGiderForm
            islemToEdit={islemToEdit}
            onSuccess={handleCloseSheet}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
