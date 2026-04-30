import type { Ticket } from './ticket';

export interface HealthDeduction {
  reason: string;
  points: number;
  product_name?: string;
}

export interface HealthExclusion {
  reason: string;
  install_id: number;
  product_name?: string;
}

export interface AccountHealth {
  account_id: number;
  health_score: number;
  health_status: 'Healthy' | 'At-Risk' | 'Critical';
  breakdown: {
    base_score: number;
    deductions: HealthDeduction[];
    exclusions: HealthExclusion[];
  };
  open_tickets: Ticket[];
  last_visit_date?: string;
  recalculated_at: string;
}

export interface HealthHistoryEntry {
  log_id: number;
  account_id: number;
  health_score: number;
  health_status: 'Healthy' | 'At-Risk' | 'Critical';
  calculated_at: string;
}
