'use client';

import { useTasks, Task } from '@/lib/hooks/use-tasks';
import { TaskItem } from './task-item';
import { motion } from 'framer-motion';

export function TaskList() {
  const { tasks, isLoading, isError } = useTasks();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 border-2 border-destructive/50 rounded-2xl bg-gradient-to-br from-destructive/10 to-red-50 text-destructive shadow-lg">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">Oops! Something went wrong</h3>
          <p className="text-sm">Failed to load tasks. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-12 border-2 border-dashed border-primary/30 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
            <svg
              className="w-8 h-8 text-primary/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground/80">No tasks yet</h3>
            <p className="text-muted-foreground mt-2">
              Get started by creating your first task above!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <TaskItem task={task} />
        </motion.div>
      ))}
    </div>
  );
}
