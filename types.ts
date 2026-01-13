
export interface LinkHistoryItem {
  id: string;
  phone: string;
  message: string;
  url: string;
  timestamp: number;
}

export type AppState = 'input' | 'result';
