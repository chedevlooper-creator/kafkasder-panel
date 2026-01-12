import { useState } from 'react'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { useDeleteDonation } from '@/hooks/use-api'
import type { Bagis } from '@/types'

interface DonationActionsProps {
  donation: Bagis
}

export function DonationActions({ donation }: DonationActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { mutate: deleteDonation, isPending: isDeleting } = useDeleteDonation()

  const handleDelete = () => {
    deleteDonation(donation.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            aria-label={`${donation.bagisci.ad} ${donation.bagisci.soyad} bağışı için işlemler menüsü`}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">İşlemler</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
            Detay
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('edit-donation', { detail: donation }))}>
            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bağışı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{donation.bagisci.ad} {donation.bagisci.soyad}</strong> adlı kişinin bağışını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
