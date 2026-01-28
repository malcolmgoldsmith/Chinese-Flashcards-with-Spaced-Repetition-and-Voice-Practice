import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Mic, BarChart3, BookOpen } from 'lucide-react';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { FlashcardReview } from './components/FlashcardReview';
import { VoicePractice } from './components/VoicePractice';
import { CardDeck } from './components/CardDeck';
import { ProgressStats } from './components/ProgressStats';
type Tab = 'review' | 'practice' | 'deck' | 'stats';
export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('review');
  const {
    cards,
    addCard,
    deleteCard,
    getCardsForReview,
    recordReview,
    getStats
  } = useSpacedRepetition();
  const dueCards = getCardsForReview();
  const stats = getStats();
  const renderContent = () => {
    switch (activeTab) {
      case 'review':
        return <FlashcardReview cards={dueCards} onReview={recordReview} />;
      case 'practice':
        return <VoicePractice cards={cards} />;
      case 'deck':
        return (
          <CardDeck
            cards={cards}
            onAddCard={addCard}
            onDeleteCard={deleteCard} />);


      case 'stats':
        return <ProgressStats stats={stats} />;
      default:
        return null;
    }
  };
  return (
    <div className="h-screen w-full bg-[#FFFBF5] text-[#1a1a1a] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-[#FFFBF5] z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center text-white font-serif font-bold">
            文
          </div>
          <h1 className="text-xl font-bold tracking-tight font-serif">
            Ink & Memory
          </h1>
        </div>
        <div className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
          {dueCards.length} due
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.2
            }}
            className="h-full w-full">

            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-stone-100 px-6 py-3 pb-safe">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <NavButton
            active={activeTab === 'review'}
            onClick={() => setActiveTab('review')}
            icon={Layers}
            label="Review"
            badge={dueCards.length > 0 ? dueCards.length : undefined} />

          <NavButton
            active={activeTab === 'practice'}
            onClick={() => setActiveTab('practice')}
            icon={Mic}
            label="Practice" />

          <NavButton
            active={activeTab === 'deck'}
            onClick={() => setActiveTab('deck')}
            icon={BookOpen}
            label="Deck" />

          <NavButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={BarChart3}
            label="Stats" />

        </div>
      </nav>
    </div>);

}
function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge






}: {active: boolean;onClick: () => void;icon: any;label: string;badge?: number;}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center space-y-1 relative w-16 transition-colors ${active ? 'text-red-700' : 'text-stone-400 hover:text-stone-600'}`}>

      <div className="relative">
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        {badge !== undefined && badge > 0 &&
        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
            {badge}
          </span>
        }
      </div>
      <span className="text-[10px] font-medium">{label}</span>
      {active &&
      <motion.div
        layoutId="nav-indicator"
        className="absolute -bottom-3 w-12 h-1 bg-red-700 rounded-t-full" />

      }
    </button>);

}