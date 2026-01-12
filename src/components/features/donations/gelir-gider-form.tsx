'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateGelirGider, useUpdateGelirGider } from '@/hooks/use-api'
import {
  GELIR_KATEGORI_LABELS,
  GIDER_KATEGORI_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@/lib/constants'
import { gelirGiderSchema, type GelirGiderFormData } from '@/lib/validators'
import type { GelirGider } from '@/types'

interface GelirGiderFormProps {
  onSuccess?: () => void
  islemToEdit?: GelirGider | null
}

export function GelirGiderForm({ onSuccess, islemToEdit }: GelirGiderFormProps) {
  const isEditMode = !!islemToEdit
  const form = useForm<GelirGiderFormData>({
    resolver: zodResolver(gelirGiderSchema),
    defaultValues: islemToEdit ? {
      islemTuru: islemToEdit.islemTuru,
      kategori: islemToEdit.kategori,
      tutar: islemToEdit.tutar,
      currency: islemToEdit.currency,
      aciklama: islemToEdit.aciklama,
      tarih: islemToEdit.tarih.toISOString().split('T')[0],
      odemeYontemi: islemToEdit.odemeYontemi,
      makbuzNo: islemToEdit.makbuzNo || '',
      faturaNo: islemToEdit.faturaNo || '',
      ilgiliKisi: islemToEdit.ilgiliKisi || '',
      referansId: islemToEdit.referansId || '',
    } : {
      islemTuru: 'gelir',
      kategori: '',
      tutar: 0,
      currency: 'TRY',
      aciklama: '',
      tarih: new Date().toISOString().split('T')[0],
      odemeYontemi: 'nakit',
      makbuzNo: '',
      faturaNo: '',
      ilgiliKisi: '',
      referansId: '',
    },
  })

  const { mutate: createMutate, isPending: isCreatePending } = useCreateGelirGider({
    onSuccess: () => {
      onSuccess?.()
    },
  })

  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateGelirGider({
    onSuccess: () => {
      onSuccess?.()
    },
  })

  const isPending = isCreatePending || isUpdatePending

  // Watch islemTuru to update kategori options
  const islemTuru = form.watch('islemTuru')

  function onSubmit(data: GelirGiderFormData) {
    const islemData = {
      islemTuru: data.islemTuru,
      kategori: data.kategori,
      tutar: data.tutar,
      currency: data.currency,
      aciklama: data.aciklama,
      tarih: new Date(data.tarih),
      odemeYontemi: data.odemeYontemi,
      makbuzNo: data.makbuzNo || undefined,
      faturaNo: data.faturaNo || undefined,
      ilgiliKisi: data.ilgiliKisi || undefined,
      referansId: data.referansId || undefined,
    } as Partial<GelirGider>

    if (isEditMode && islemToEdit) {
      updateMutate({ id: islemToEdit.id, data: islemData })
    } else {
      createMutate(islemData)
    }
  }

  const getKategoriOptions = () => {
    if (islemTuru === 'gelir') {
      return Object.entries(GELIR_KATEGORI_LABELS).map(([value, label]) => ({
        value,
        label,
      }))
    }
    return Object.entries(GIDER_KATEGORI_LABELS).map(([value, label]) => ({
      value,
      label,
    }))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="islemTuru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İşlem Türü *</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value)
                  // Reset kategori when islemTuru changes
                  form.setValue('kategori', '')
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gelir">Gelir</SelectItem>
                    <SelectItem value="gider">Gider</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kategori"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!islemTuru}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getKategoriOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="tutar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tutar *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Para Birimi *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TRY">₺ TRY</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="odemeYontemi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ödeme Yöntemi *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="tarih"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarih *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ilgiliKisi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İlgili Kişi/Kurum</FormLabel>
                <FormControl>
                  <Input placeholder="Kişi veya kurum adı" {...field} />
                </FormControl>
                <FormDescription>
                  İşlem ile ilgili kişi veya kurum
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="makbuzNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Makbuz No</FormLabel>
                <FormControl>
                  <Input placeholder="MK-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="faturaNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatura No</FormLabel>
                <FormControl>
                  <Input placeholder="FT-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="aciklama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="İşlem açıklaması..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            İptal
          </Button>
          <Button type="submit" loading={isPending}>
            {isPending ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
