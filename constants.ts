import { Signal, HistoryItem } from './types';

export const MOCK_SIGNALS: Signal[] = [
  {
    id: '1',
    pair: 'EUR/USD',
    type: 'BUY',
    entryPrice: 1.0850,
    stopLoss: 1.0820,
    takeProfit: 1.0910,
    status: 'ACTIVE',
    timestamp: '15m ago',
  },
  {
    id: '2',
    pair: 'GBP/JPY',
    type: 'SELL',
    entryPrice: 184.20,
    stopLoss: 184.80,
    takeProfit: 183.00,
    status: 'PENDING',
    timestamp: '1h ago',
  },
  {
    id: '3',
    pair: 'XAU/USD',
    type: 'SELL',
    entryPrice: 2045.50,
    stopLoss: 2055.00,
    takeProfit: 2025.00,
    status: 'ACTIVE',
    timestamp: '2h ago',
  },
  {
    id: '4',
    pair: 'USD/CAD',
    type: 'BUY',
    entryPrice: 1.3510,
    stopLoss: 1.3480,
    takeProfit: 1.3580,
    status: 'ACTIVE',
    timestamp: '3h ago',
  },
  {
    id: '5',
    pair: 'BTC/USD',
    type: 'BUY',
    entryPrice: 43500,
    stopLoss: 42000,
    takeProfit: 45000,
    status: 'PENDING',
    timestamp: '5h ago',
  }
];

export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '101',
    date: 'Oct 24, 2023',
    pair: 'EUR/USD',
    type: 'BUY',
    entryPrice: 1.0520,
    closePrice: 1.0650,
    pips: 130,
    result: 'WIN'
  },
  {
    id: '102',
    date: 'Oct 23, 2023',
    pair: 'GBP/JPY',
    type: 'SELL',
    entryPrice: 182.50,
    closePrice: 181.20,
    pips: 130,
    result: 'WIN'
  },
  {
    id: '103',
    date: 'Oct 22, 2023',
    pair: 'XAU/USD',
    type: 'BUY',
    entryPrice: 1980.00,
    closePrice: 1975.00,
    pips: -50,
    result: 'LOSS'
  },
  {
    id: '104',
    date: 'Oct 20, 2023',
    pair: 'USD/CHF',
    type: 'SELL',
    entryPrice: 0.8950,
    closePrice: 0.8910,
    pips: 40,
    result: 'WIN'
  },
  {
    id: '105',
    date: 'Oct 19, 2023',
    pair: 'AUD/USD',
    type: 'BUY',
    entryPrice: 0.6350,
    closePrice: 0.6320,
    pips: -30,
    result: 'LOSS'
  }
];