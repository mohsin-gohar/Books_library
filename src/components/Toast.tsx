import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLibrary } from '../context/LibraryContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { activeToast, dismissToast } = useLibrary();

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xl border border-stone-800 dark:border-stone-200 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{activeToast}</span>
            <button
              onClick={dismissToast}
              className="p-1 hover:opacity-75 transition-opacity ml-1 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
