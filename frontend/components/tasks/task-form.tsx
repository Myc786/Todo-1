'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '@/lib/hooks/use-tasks';
import { PlusCircle, Loader2 } from 'lucide-react';

export function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await addTask(title, description);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg backdrop-blur-sm"
    >
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-semibold leading-none text-foreground/80"
        >
          Task Title
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex h-12 w-full rounded-xl border-2 border-primary/20 bg-white/80 px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-semibold leading-none text-foreground/80"
        >
          Description (optional)
        </label>
        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          className="flex min-h-[100px] w-full rounded-xl border-2 border-primary/20 bg-white/80 px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-none shadow-sm"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="inline-flex items-center justify-center rounded-xl text-base font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:opacity-90 h-12 px-6 w-full shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </motion.div>
          ) : (
            <motion.div
              key="submit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Task
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
}
