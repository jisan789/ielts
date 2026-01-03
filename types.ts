
export enum EnglishLevel {
  BEGINNER = 'Band 4.0 - 5.0',
  INTERMEDIATE = 'Band 5.5 - 6.5',
  ADVANCED = 'Band 7.0 - 9.0'
}

export enum PersonaType {
  EMMA = 'Emma'
}

export enum SessionMode {
  PRACTICE = 'Practice Mode',
  EXAM = 'Mock Exam Mode'
}

export type LearningGoal = 'Part 1: General Questions' | 'Part 2: Cue Card' | 'Part 3: Abstract Discussion' | 'Full Mock Test' | 'Vocabulary & Idioms';

export interface UserProfile {
  name: string;
  level: EnglishLevel;
  goals: LearningGoal[];
  persona: PersonaType;
  streak: number;
  lastActive: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  correction?: Correction;
}

export interface SessionReport {
  summary: string;
  mistakes: string[];
  vocabularyTips: string[];
  newWords: string[];
  score: number;
  fluencyScore: number;
}