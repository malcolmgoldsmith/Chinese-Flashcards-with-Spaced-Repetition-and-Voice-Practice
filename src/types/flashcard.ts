export interface FlashCard {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  createdAt: number;
}

export interface CardReview {
  cardId: string;
  interval: number; // Days until next review
  easeFactor: number; // SM-2 ease factor (starts at 2.5)
  nextReview: number; // Timestamp
  repetitions: number; // Consecutive correct reviews
}

export enum ReviewQuality {
  Again = 0, // Complete blackout
  Hard = 1, // Correct response but with much effort
  Good = 2, // Correct response with a little hesitation
  Easy = 3 // Perfect response
  ,}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  count: number;
}