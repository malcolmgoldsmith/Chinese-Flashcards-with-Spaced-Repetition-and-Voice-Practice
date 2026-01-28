import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCard } from '../types/flashcard';
import { Search, Plus, Trash2, Volume2 } from 'lucide-react';
import { AddCardModal } from './AddCardModal';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
interface CardDeckProps {
  cards: FlashCard[];
  onAddCard: (card: {
    chinese: string;
    pinyin: string;
    english: string;
  }) => void;
  onDeleteCard: (id: string) => void;
}
export function CardDeck({ cards, onAddCard, onDeleteCard }: CardDeckProps) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { speak } = useTextToSpeech();
  const filteredCards = cards.filter(
    (card) =>
    card.chinese.includes(search) ||
    card.english.toLowerCase().includes(search.toLowerCase()) ||
    card.pinyin.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full">
      <div className="p-4 space-y-4 bg-[#FFFBF5] sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            My Deck
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-stone-900 text-white p-2 rounded-full hover:bg-stone-800 transition-colors shadow-lg">

            <Plus size={24} />
          </button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
            size={18} />

          <input
            type="text"
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all" />

        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="grid gap-3">
          <AnimatePresence>
            {filteredCards.map((card, index) =>
            <motion.div
              key={card.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.95
              }}
              transition={{
                delay: index * 0.05
              }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between group">

                <div className="flex items-center space-x-4">
                  <div
                  className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-xl font-serif font-bold text-stone-900 cursor-pointer hover:bg-stone-100 transition-colors"
                  onClick={() => speak(card.chinese)}>

                    {card.chinese}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800">{card.pinyin}</p>
                    <p className="text-sm text-stone-500">{card.english}</p>
                  </div>
                </div>

                <button
                onClick={() => onDeleteCard(card.id)}
                className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">

                  <Trash2 size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredCards.length === 0 &&
          <div className="text-center py-12 text-stone-400">
              <p>No cards found matching "{search}"</p>
            </div>
          }
        </div>
      </div>

      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAddCard} />

    </div>);

}