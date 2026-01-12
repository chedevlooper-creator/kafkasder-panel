'use client'

import { useTamagotchiStore } from '@/stores/tamagotchi-store'

export const PixelPet = () => {
  const { status, isAlive } = useTamagotchiStore()

  // Pixel art using CSS grid or nested divs
  const renderPet = () => {
    if (!isAlive) return (
      <div className="relative w-32 h-32 flex items-center justify-center grayscale opacity-50">
         <span className="text-4xl">💀</span>
      </div>
    )

    switch (status) {
      case 'eating':
        return <div className="animate-bounce text-6xl">🍔🦖</div>
      case 'playing':
        return <div className="animate-ping text-6xl">⚽🦖</div>
      case 'sleeping':
        return <div className="animate-pulse text-6xl">💤🦖</div>
      default:
        return (
          <div className="relative w-32 h-32 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-primary rounded-lg border-4 border-black relative overflow-hidden">
               {/* Eyes */}
               <div className="absolute top-6 left-4 w-4 h-4 bg-black rounded-sm animate-blink" />
               <div className="absolute top-6 right-4 w-4 h-4 bg-black rounded-sm animate-blink" />
               {/* Mouth */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-2 bg-black rounded-full" />
            </div>
            {/* Feet */}
            <div className="flex gap-8 -mt-2">
                <div className="w-6 h-4 bg-primary border-4 border-black rounded-b-md" />
                <div className="w-6 h-4 bg-primary border-4 border-black rounded-b-md" />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-100 rounded-2xl border-8 border-zinc-300 shadow-inner min-h-[300px]">
      {renderPet()}
      <style jsx>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 3s infinite;
        }
      `}</style>
    </div>
  )
}
