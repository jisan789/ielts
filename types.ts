import React from 'react';

export interface Signal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  status: 'ACTIVE' | 'PENDING';
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  closePrice: number;
  pips: number;
  result: 'WIN' | 'LOSS';
}

export type ViewState = 'dashboard' | 'signals' | 'profile';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}