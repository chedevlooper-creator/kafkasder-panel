
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TamagotchiState, TamagotchiActions } from '@/types/tamagotchi';

const INITIAL_STATE: TamagotchiState = {
  name: 'Goosey',
  hunger: 100,
  happiness: 100,
  energy: 100,
  health: 100,
  age: 0,
  lastUpdate: Date.now(),
  status: 'idle',
  isAlive: true,
};

export const useTamagotchiStore = create<TamagotchiState & TamagotchiActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setName: (name: string) => set({ name }),

      feed: () => {
        const { isAlive, hunger, status } = get();
        if (!isAlive || status === 'sleeping') return;
        set({ 
          hunger: Math.min(hunger + 20, 100),
          status: 'eating'
        });
        setTimeout(() => {
            const currentStatus = get().status;
            if (currentStatus === 'eating') set({ status: 'idle' });
        }, 3000);
      },

      play: () => {
        const { isAlive, happiness, energy, status } = get();
        if (!isAlive || status === 'sleeping' || energy < 10) return;
        set({ 
          happiness: Math.min(happiness + 20, 100),
          energy: Math.max(energy - 10, 0),
          status: 'playing'
        });
        setTimeout(() => {
            const currentStatus = get().status;
            if (currentStatus === 'playing') set({ status: 'idle' });
        }, 3000);
      },

      sleep: () => {
        const { isAlive, status } = get();
        if (!isAlive || status === 'sleeping') return;
        set({ status: 'sleeping' });
      },

      wakeUp: () => {
        if (get().status === 'sleeping') {
          set({ status: 'idle' });
        }
      },

      tick: () => {
        const { isAlive, hunger, happiness, energy, health, age, status } = get();
        if (!isAlive) return;

        let newHunger = hunger;
        let newHappiness = happiness;
        let newEnergy = energy;
        let newHealth = health;
        let newStatus = status;

        if (status === 'sleeping') {
          newEnergy = Math.min(energy + 5, 100);
          newHunger = Math.max(hunger - 1, 0);
          if (newEnergy === 100) newStatus = 'idle';
        } else {
          newHunger = Math.max(hunger - 1, 0);
          newHappiness = Math.max(happiness - 1, 0);
          newEnergy = Math.max(energy - 0.5, 0);
        }

        // Health logic
        if (newHunger === 0 || newHappiness === 0) {
          newHealth = Math.max(health - 2, 0);
        } else if (newHunger > 50 && newHappiness > 50) {
          newHealth = Math.min(health + 1, 100);
        }

        const stillAlive = newHealth > 0;

        set({
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          health: newHealth,
          status: stillAlive ? newStatus : 'dead',
          isAlive: stillAlive,
          age: age + 0.1,
          lastUpdate: Date.now(),
        });
      },

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'tamagotchi-storage',
    }
  )
);
