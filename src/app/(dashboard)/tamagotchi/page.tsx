'use client'

import dynamic from 'next/dynamic'
import { PageHeader } from '@/components/shared/page-header'

// Lazy load tamagotchi game - non-critical feature
const TamagotchiGame = dynamic(
  () => import('@/components/features/tamagotchi/tamagotchi-game').then(mod => ({ default: mod.TamagotchiGame })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg animate-pulse">
        <p className="text-muted-foreground">Oyun yükleniyor...</p>
      </div>
    ),
    ssr: false
  }
)

export default function TamagotchiPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Pixel Tamagotchi"
        description="Bilgisayarınızda yaşayan piksel dostunuzla ilgilenin."
      />
      <div className="mt-8">
        <TamagotchiGame />
      </div>
    </div>
  )
}
