import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FlashCard } from '../types/flashcard';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { Mic, Volume2, RefreshCw, Check, X } from 'lucide-react';
interface VoicePracticeProps {
  cards: FlashCard[];
}
export function VoicePractice({ cards }: VoicePracticeProps) {
  const [currentCard, setCurrentCard] = useState<FlashCard | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none');
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    resetTranscript
  } = useSpeechRecognition();
  const { speak } = useTextToSpeech();
  useEffect(() => {
    if (cards.length > 0) {
      pickRandomCard();
    }
  }, [cards]);
  useEffect(() => {
    if (transcript && currentCard) {
      // Simple check: if transcript contains the character
      // In a real app, we might want pinyin matching or fuzzy matching
      if (transcript.includes(currentCard.chinese)) {
        setFeedback('success');
      } else {
        // Only set error if we have a substantial transcript that doesn't match
        if (transcript.length >= currentCard.chinese.length) {

          // Don't immediately fail, give it a moment or wait for stop
        }}
    }
  }, [transcript, currentCard]);
  const pickRandomCard = () => {
    const random = cards[Math.floor(Math.random() * cards.length)];
    setCurrentCard(random);
    setFeedback('none');
    resetTranscript();
  };
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      // Check result on stop
      if (currentCard && transcript) {
        if (transcript.includes(currentCard.chinese)) {
          setFeedback('success');
        } else {
          setFeedback('error');
        }
      }
    } else {
      setFeedback('none');
      startListening();
    }
  };
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-stone-500">
          Voice recognition is not supported in this browser. Please try Chrome
          or Safari.
        </p>
      </div>);

  }
  if (!currentCard) return null;
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-2">
          Voice Practice
        </h2>
        <p className="text-stone-500 text-sm">Read the character aloud</p>
      </div>

      <div className="relative w-full aspect-square max-w-[280px] bg-white rounded-3xl shadow-xl border border-stone-100 flex flex-col items-center justify-center mb-12 p-8">
        <h1 className="text-8xl font-serif text-stone-900 mb-4">
          {currentCard.chinese}
        </h1>
        <p className="text-stone-400 text-lg">{currentCard.english}</p>

        <button
          onClick={() => speak(currentCard.chinese)}
          className="absolute top-4 right-4 p-2 text-stone-300 hover:text-stone-500 transition-colors">

          <Volume2 size={24} />
        </button>
      </div>

      <div className="w-full mb-8 min-h-[60px] flex items-center justify-center">
        {feedback === 'success' ?
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">

            <Check size={20} />
            <span className="font-bold">Correct! Great pronunciation.</span>
          </motion.div> :
        feedback === 'error' ?
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="flex flex-col items-center">

            <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-full mb-2">
              <X size={20} />
              <span className="font-bold">Try again</span>
            </div>
            <p className="text-stone-400 text-sm">Heard: "{transcript}"</p>
          </motion.div> :

        <p
          className={`text-xl font-medium ${isListening ? 'text-stone-800' : 'text-stone-300'}`}>

            {transcript || (isListening ? 'Listening...' : 'Tap mic to start')}
          </p>
        }
      </div>

      <div className="flex items-center space-x-6">
        {feedback === 'success' ?
        <button
          onClick={pickRandomCard}
          className="h-16 w-16 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">

            <RefreshCw size={28} />
          </button> :

        <button
          onClick={toggleListening}
          className={`h-20 w-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isListening ? 'bg-red-600 text-white scale-110 ring-4 ring-red-100' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>

            <Mic size={32} className={isListening ? 'animate-pulse' : ''} />
          </button>
        }
      </div>

      {feedback === 'success' &&
      <motion.p
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className="mt-6 text-stone-400 text-sm cursor-pointer hover:text-stone-600"
        onClick={pickRandomCard}>

          Tap to skip
        </motion.p>
      }
    </div>);

}