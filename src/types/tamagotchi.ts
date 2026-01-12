
export type TamagotchiStatus = 'idle' | 'eating' | 'sleeping' | 'playing' | 'dead';

export interface TamagotchiState {
  name: string;
  hunger: number; // 0-100
  happiness: number; // 0-100
  energy: number; // 0-100
  health: number; // 0-100
  age: number;
  lastUpdate: number;
  status: TamagotchiStatus;
  isAlive: boolean;
}

export interface TamagotchiActions {
  feed: () => void;
  play: () => void;
  sleep: () => void;
  wakeUp: () => void;
  tick: () => void;
  reset: () => void;
  setName: (name: string) => void;
}
