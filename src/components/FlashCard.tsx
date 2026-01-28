import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCard as FlashCardType } from '../types/flashcard';
import { Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
interface FlashCardProps {
  card: FlashCardType;
  isFlipped: boolean;
  onFlip: () => void;
}
export function FlashCard({ card, isFlipped, onFlip }: FlashCardProps) {
  const { speak } = useTextToSpeech();
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(card.chinese);
  };
  return (
    <div
      className="relative w-full max-w-sm aspect-[3/4] perspective-1000 cursor-pointer group"
      onClick={onFlip}>

      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        animate={{
          rotateY: isFlipped ? 180 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
        style={{
          transformStyle: 'preserve-3d'
        }}>

        {/* Front of Card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-stone-100 flex flex-col items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden'
          }}>

          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleSpeak}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Pronounce">

              <Volume2 size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-6xl md:text-7xl font-serif text-stone-900 mb-4 text-center leading-tight">
              {card.chinese}
            </h2>
            <p className="text-stone-400 text-sm font-medium tracking-widest uppercase mt-8">
              Tap to reveal
            </p>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-red-700/20 rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-red-700/20 rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-red-700/20 rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-red-700/20 rounded-br-sm" />
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-stone-50 rounded-3xl shadow-xl border border-stone-200 flex flex-col items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}>

          <div className="absolute top-6 right-6">
            <button
              onClick={handleSpeak}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-colors"
              aria-label="Pronounce">

              <Volume2 size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-2xl text-stone-500 font-medium mb-2 font-serif">
              {card.chinese}
            </p>
            <h3 className="text-3xl font-bold text-red-700 mb-6 font-serif">
              {card.pinyin}
            </h3>
            <div className="w-12 h-1 bg-stone-200 rounded-full mb-6"></div>
            <p className="text-xl text-stone-800 leading-relaxed">
              {card.english}
            </p>
          </div>
        </div>
      </motion.div>
    </div>);

}