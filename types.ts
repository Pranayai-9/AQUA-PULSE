export enum AppView {
  DASHBOARD = 'DASHBOARD',
  GRID = 'GRID',
  AR_REPAIR = 'AR_REPAIR',
  COMMUNITY = 'COMMUNITY',
  SETTINGS = 'SETTINGS'
}

export interface WaterEvent {
  id: string;
  timestamp: Date;
  appliance: string;
  volume: number; // in gallons
  icon: string;
  isLeak?: boolean;
}

export interface NeighborData {
  id: string;
  x: number;
  y: number;
  pressure: number; // 0-100 psi
  status: 'normal' | 'low' | 'critical';
}

export interface DailyStats {
  used: number;
  goal: number;
  projectedBill: number;
  averageBill: number;
}