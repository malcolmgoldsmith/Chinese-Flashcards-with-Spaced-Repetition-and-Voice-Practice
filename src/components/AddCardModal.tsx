import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: {chinese: string;pinyin: string;english: string;}) => void;
}
export function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [chinese, setChinese] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [english, setEnglish] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chinese && pinyin && english) {
      onAdd({
        chinese,
        pinyin,
        english
      });
      setChinese('');
      setPinyin('');
      setEnglish('');
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <motion.div
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
          y: 20
        }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-800 font-serif">
            Add New Card
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600">

            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">
              Chinese Character
            </label>
            <input
              type="text"
              value={chinese}
              onChange={(e) => setChinese(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-lg"
              placeholder="e.g. 你好"
              autoFocus />

          </div>

          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">
              Pinyin
            </label>
            <input
              type="text"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
              placeholder="e.g. nǐ hǎo" />

          </div>

          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">
              English Meaning
            </label>
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
              placeholder="e.g. Hello" />

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!chinese || !pinyin || !english}
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

              Create Card
            </button>
          </div>
        </form>
      </motion.div>
    </div>);

}