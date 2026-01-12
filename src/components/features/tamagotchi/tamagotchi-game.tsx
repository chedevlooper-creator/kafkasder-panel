'use client'

import { useEffect } from 'react'
import { useTamagotchiStore } from '@/stores/tamagotchi-store'
import { PixelPet } from './pixel-pet'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Utensils, Gamepad2, Sun, RefreshCcw } from 'lucide-react'

export const TamagotchiGame = () => {
  const state = useTamagotchiStore()
  
  useEffect(() => {
    const interval = setInterval(() => {
      state.tick()
    }, 5000)
    return () => clearInterval(interval)
  }, [state])

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="text-center border-b-4 border-black bg-zinc-50">
          <CardTitle className="text-2xl font-black uppercase tracking-widest">
            {state.name}
            {!state.isAlive && <span className="ml-2">(EXPIRED)</span>}
          </CardTitle>
          <p className="text-sm font-bold text-muted-foreground">Yaş: {state.age.toFixed(1)}</p>
        </CardHeader>
        <CardContent className="p-6 space-y-8 bg-white">
          <PixelPet />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="flex items-center gap-1"><Utensils className="w-3 h-3" /> Açlık</span>
                <span>{Math.round(state.hunger)}%</span>
              </div>
              <Progress value={state.hunger} className="h-3 border-2 border-black rounded-none" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" /> Mutluluk</span>
                <span>{Math.round(state.happiness)}%</span>
              </div>
              <Progress value={state.happiness} className="h-3 border-2 border-black rounded-none" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Enerji</span>
                <span>{Math.round(state.energy)}%</span>
              </div>
              <Progress value={state.energy} className="h-3 border-2 border-black rounded-none" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> Sağlık</span>
                <span>{Math.round(state.health)}%</span>
              </div>
              <Progress value={state.health} className="h-3 border-2 border-black rounded-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 font-bold h-12"
              onClick={state.feed}
              disabled={!state.isAlive || state.status === 'sleeping'}
            >
              BESLE
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 font-bold h-12"
              onClick={state.play}
              disabled={!state.isAlive || state.status === 'sleeping'}
            >
              OYNAMAK
            </Button>
            {state.status === 'sleeping' ? (
              <Button 
                variant="outline"
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 font-bold h-12"
                onClick={state.wakeUp}
                disabled={!state.isAlive}
              >
                UYANDIR
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 font-bold h-12"
                onClick={state.sleep}
                disabled={!state.isAlive}
              >
                UYUT
              </Button>
            )}
          </div>

          {!state.isAlive && (
            <Button 
              className="w-full border-2 border-black bg-red-500 hover:bg-red-600 font-bold"
              onClick={state.reset}
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> YENİDEN BAŞLAT
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
