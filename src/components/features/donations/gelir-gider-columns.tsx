'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GelirGiderActions } from './gelir-gider-actions'
import {
  GELIR_GIDER_KATEGORI_LABELS,
  ISLEM_TURU_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { GelirGider } from '@/types'

export const gelirGiderColumns: ColumnDef<GelirGider>[] = [
  {
    accessorKey: 'tarih',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Tarih
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">{formatDate(row.original.tarih)}</span>
    ),
  },
  {
    accessorKey: 'islemTuru',
    header: 'Tür',
    cell: ({ row }) => {
      const islemTuru = row.original.islemTuru
      return (
        <Badge
          variant={islemTuru === 'gelir' ? 'success' : 'destructive'}
          className="flex items-center gap-1"
        >
          {islemTuru === 'gelir' ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {ISLEM_TURU_LABELS[islemTuru]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value === row.getValue(id)
    }
  },
  {
    accessorKey: 'kategori',
    header: 'Kategori',
    cell: ({ row }) => (
      <span className="text-sm">
        {GELIR_GIDER_KATEGORI_LABELS[row.original.kategori]}
      </span>
    ),
  },
  {
    accessorKey: 'aciklama',
    header: 'Açıklama',
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p className="text-sm truncate">{row.original.aciklama}</p>
      </div>
    ),
  },
  {
    accessorKey: 'tutar',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Tutar
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const tutar = row.original.tutar
      const isGelir = row.original.islemTuru === 'gelir'
      return (
        <span className={`font-mono font-semibold ${isGelir ? 'text-green-600' : 'text-red-600'}`}>
          {isGelir ? '+' : '-'}{formatCurrency(tutar, row.original.currency)}
        </span>
      )
    },
  },
  {
    accessorKey: 'odemeYontemi',
    header: 'Ödeme Yöntemi',
    cell: ({ row }) => (
      <span className="text-sm">
        {PAYMENT_METHOD_LABELS[row.original.odemeYontemi]}
      </span>
    ),
  },
  {
    accessorKey: 'ilgiliKisi',
    header: 'İlgili Kişi',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.ilgiliKisi || '-'}</span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <GelirGiderActions islem={row.original} />
  }
]
