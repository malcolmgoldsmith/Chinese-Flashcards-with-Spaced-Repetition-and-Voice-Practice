import { useState, useEffect, useCallback } from 'react';
import {
  FlashCard,
  CardReview,
  ReviewQuality,
  DailyStats } from
'../types/flashcard';

const STORAGE_KEY_CARDS = 'chinese_flashcards_cards';
const STORAGE_KEY_REVIEWS = 'chinese_flashcards_reviews';
const STORAGE_KEY_STATS = 'chinese_flashcards_stats';

const INITIAL_CARDS: FlashCard[] = [
{
  id: '1',
  chinese: '你好',
  pinyin: 'nǐ hǎo',
  english: 'Hello',
  createdAt: Date.now()
},
{
  id: '2',
  chinese: '谢谢',
  pinyin: 'xiè xiè',
  english: 'Thank you',
  createdAt: Date.now()
},
{
  id: '3',
  chinese: '再见',
  pinyin: 'zài jiàn',
  english: 'Goodbye',
  createdAt: Date.now()
},
{
  id: '4',
  chinese: '是',
  pinyin: 'shì',
  english: 'To be / Yes',
  createdAt: Date.now()
},
{
  id: '5',
  chinese: '不',
  pinyin: 'bù',
  english: 'No / Not',
  createdAt: Date.now()
},
{
  id: '6',
  chinese: '我',
  pinyin: 'wǒ',
  english: 'I / Me',
  createdAt: Date.now()
},
{
  id: '7',
  chinese: '你',
  pinyin: 'nǐ',
  english: 'You',
  createdAt: Date.now()
},
{
  id: '8',
  chinese: '好',
  pinyin: 'hǎo',
  english: 'Good',
  createdAt: Date.now()
}];


export function useSpacedRepetition() {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [reviews, setReviews] = useState<Record<string, CardReview>>({});
  const [stats, setStats] = useState<DailyStats[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadedCards = localStorage.getItem(STORAGE_KEY_CARDS);
    const loadedReviews = localStorage.getItem(STORAGE_KEY_REVIEWS);
    const loadedStats = localStorage.getItem(STORAGE_KEY_STATS);

    if (loadedCards) {
      setCards(JSON.parse(loadedCards));
    } else {
      setCards(INITIAL_CARDS);
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(INITIAL_CARDS));
    }

    if (loadedReviews) {
      setReviews(JSON.parse(loadedReviews));
    }

    if (loadedStats) {
      setStats(JSON.parse(loadedStats));
    }
  }, []);

  // Save data when changed
  useEffect(() => {
    if (cards.length > 0)
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    if (Object.keys(reviews).length > 0)
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (stats.length > 0)
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  const addCard = useCallback((card: Omit<FlashCard, 'id' | 'createdAt'>) => {
    const newCard: FlashCard = {
      ...card,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setCards((prev) => [...prev, newCard]);
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setReviews((prev) => {
      const newReviews = { ...prev };
      delete newReviews[id];
      return newReviews;
    });
  }, []);

  const getCardsForReview = useCallback(() => {
    const now = Date.now();
    return cards.filter((card) => {
      const review = reviews[card.id];
      // If never reviewed, it's due
      if (!review) return true;
      // If next review time is in the past, it's due
      return review.nextReview <= now;
    });
  }, [cards, reviews]);

  const recordReview = useCallback((cardId: string, quality: ReviewQuality) => {
    setReviews((prev) => {
      const currentReview = prev[cardId] || {
        cardId,
        interval: 0,
        easeFactor: 2.5,
        nextReview: 0,
        repetitions: 0
      };

      // SM-2 Algorithm
      let interval: number;
      let repetitions: number;
      let easeFactor = currentReview.easeFactor;

      if (quality >= ReviewQuality.Good) {
        if (currentReview.repetitions === 0) {
          interval = 1;
        } else if (currentReview.repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.round(
            currentReview.interval * currentReview.easeFactor
          );
        }
        repetitions = currentReview.repetitions + 1;
      } else {
        repetitions = 0;
        interval = 1;
      }

      easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (easeFactor < 1.3) easeFactor = 1.3;

      const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

      return {
        ...prev,
        [cardId]: {
          cardId,
          interval,
          easeFactor,
          nextReview,
          repetitions
        }
      };
    });

    // Update stats
    const today = new Date().toISOString().split('T')[0];
    setStats((prev) => {
      const existingStatIndex = prev.findIndex((s) => s.date === today);
      if (existingStatIndex >= 0) {
        const newStats = [...prev];
        newStats[existingStatIndex].count += 1;
        return newStats;
      } else {
        return [...prev, { date: today, count: 1 }];
      }
    });
  }, []);

  const getStats = useCallback(() => {
    const totalCards = cards.length;
    const dueCount = getCardsForReview().length;

    const today = new Date().toISOString().split('T')[0];
    const todayStat = stats.find((s) => s.date === today);
    const reviewedToday = todayStat ? todayStat.count : 0;

    // Calculate streak
    let streak = 0;
    if (stats.length > 0) {
      const sortedStats = [...stats].sort((a, b) =>
      b.date.localeCompare(a.date)
      );
      const lastReviewDate = new Date(sortedStats[0].date);
      const currentDate = new Date(today);

      // Check if last review was today or yesterday to maintain streak
      const diffTime = Math.abs(
        currentDate.getTime() - lastReviewDate.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak = 1;
        let checkDate = new Date(sortedStats[0].date);

        for (let i = 1; i < sortedStats.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const expectedDateStr = checkDate.toISOString().split('T')[0];
          if (sortedStats[i].date === expectedDateStr) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      totalCards,
      dueCount,
      reviewedToday,
      streak
    };
  }, [cards, getCardsForReview, stats]);

  return {
    cards,
    addCard,
    deleteCard,
    getCardsForReview,
    recordReview,
    getStats
  };
}