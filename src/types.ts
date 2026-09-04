export type AppState = 'ACTION' | 'VENTING' | 'REST';

export interface GamePlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  comboStreak: number;
  title: string;
  spoonsRemaining: number;
  totalSpoons: number;
}

export interface FloatingReward {
  id: number;
  text: string;
  subText?: string;
  type: 'xp' | 'spoon' | 'combo' | 'rest';
}