'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteGelirGider } from '@/hooks/use-api'
import { formatCurrency } from '@/lib/utils'
import { ISLEM_TURU_LABELS } from '@/lib/constants'
import type { GelirGider } from '@/types'

interface GelirGiderActionsProps {
    islem: GelirGider
}

export function GelirGiderActions({ islem }: GelirGiderActionsProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { mutate: deleteGelirGider, isPending: isDeleting } = useDeleteGelirGider()

    const handleDelete = () => {
        deleteGelirGider(islem.id, {
            onSuccess: () => {
                setDeleteDialogOpen(false)
            }
        })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="İşlem menüsünü aç">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('edit-gelir-gider', { detail: islem }))}>
                        <Edit className="mr-2 h-4 w-4" />
                        Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Sil
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>İşlemi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            {ISLEM_TURU_LABELS[islem.islemTuru]} işlemini silmek istediğinizden emin misiniz?
                            <br />
                            <br />
                            <strong>{islem.aciklama}</strong><br />
                            Tutar: <strong>{formatCurrency(islem.tutar, islem.currency)}</strong>
                            <br /><br />
                            Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Siliniyor...' : 'Sil'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
