import React, { useEffect, useState, memo, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCard as FlashCardComponent } from './FlashCard';
import { FlashCard, ReviewQuality } from '../types/flashcard';
import { CheckCircle2, RefreshCw } from 'lucide-react';
interface FlashcardReviewProps {
  cards: FlashCard[];
  onReview: (cardId: string, quality: ReviewQuality) => void;
}
export function FlashcardReview({ cards, onReview }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const currentCard = cards[currentIndex];
  useEffect(() => {
    if (cards.length === 0) {
      setSessionComplete(true);
    } else {
      setSessionComplete(false);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [cards]);
  const handleRate = (quality: ReviewQuality) => {
    if (!currentCard) return;
    onReview(currentCard.id, quality);
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
    } else {
      setSessionComplete(true);
    }
  };
  if (cards.length === 0 && !sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          All caught up!
        </h2>
        <p className="text-stone-500 max-w-md">
          You have no cards due for review right now. Great job keeping up with
          your studies.
        </p>
      </div>);

  }
  if (sessionComplete) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="flex flex-col items-center justify-center h-full p-8 text-center">

        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 relative">
          <motion.div
            initial={{
              scale: 0
            }}
            animate={{
              scale: 1
            }}
            transition={{
              delay: 0.2,
              type: 'spring'
            }}>

            <CheckCircle2 className="text-red-600 w-12 h-12" />
          </motion.div>
          <motion.div
            className="absolute inset-0 border-4 border-red-100 rounded-full"
            initial={{
              opacity: 0,
              scale: 1.2
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: 'reverse'
            }} />

        </div>
        <h2 className="text-3xl font-bold text-stone-800 mb-2 font-serif">
          Session Complete
        </h2>
        <p className="text-stone-500 max-w-md mb-8">
          You've reviewed all your due cards for now. Come back later to
          strengthen your memory!
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 text-stone-600 hover:text-red-700 transition-colors">

          <RefreshCw size={18} />
          <span>Refresh Session</span>
        </button>
      </motion.div>);

  }
  return (
    <div className="flex flex-col items-center max-w-md mx-auto w-full h-full py-6">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <span className="text-sm font-medium text-stone-400 uppercase tracking-wider">
          Review Session
        </span>
        <span className="text-sm font-bold text-stone-800 bg-stone-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="flex-1 w-full flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{
              x: 50,
              opacity: 0
            }}
            animate={{
              x: 0,
              opacity: 1
            }}
            exit={{
              x: -50,
              opacity: 0
            }}
            transition={{
              duration: 0.3
            }}
            className="w-full flex justify-center">

            <FlashCardComponent
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)} />

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-24 w-full px-4">
        <AnimatePresence>
          {isFlipped &&
          <motion.div
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            exit={{
              y: 20,
              opacity: 0
            }}
            className="grid grid-cols-4 gap-3 w-full">

              <button
              onClick={() => handleRate(ReviewQuality.Again)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700 transition-colors border border-stone-200 hover:border-red-200">

                <span className="text-xs font-bold uppercase mb-1">Again</span>
                <span className="text-xs opacity-60">1m</span>
              </button>
              <button
              onClick={() => handleRate(ReviewQuality.Hard)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100 hover:bg-orange-100 text-stone-600 hover:text-orange-700 transition-colors border border-stone-200 hover:border-orange-200">

                <span className="text-xs font-bold uppercase mb-1">Hard</span>
                <span className="text-xs opacity-60">10m</span>
              </button>
              <button
              onClick={() => handleRate(ReviewQuality.Good)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100 hover:bg-blue-100 text-stone-600 hover:text-blue-700 transition-colors border border-stone-200 hover:border-blue-200">

                <span className="text-xs font-bold uppercase mb-1">Good</span>
                <span className="text-xs opacity-60">1d</span>
              </button>
              <button
              onClick={() => handleRate(ReviewQuality.Easy)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100 hover:bg-green-100 text-stone-600 hover:text-green-700 transition-colors border border-stone-200 hover:border-green-200">

                <span className="text-xs font-bold uppercase mb-1">Easy</span>
                <span className="text-xs opacity-60">4d</span>
              </button>
            </motion.div>
          }
        </AnimatePresence>

        {!isFlipped &&
        <div className="flex items-center justify-center h-full text-stone-400 text-sm">
            Tap card to reveal answer
          </div>
        }
      </div>
    </div>);

}