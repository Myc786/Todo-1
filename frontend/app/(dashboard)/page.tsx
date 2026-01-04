'use client';

import { motion } from 'framer-motion';
import { TaskList } from '@/components/tasks/task-list';
import { TaskForm } from '@/components/tasks/task-form';

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-10 max-w-4xl mx-auto w-full"
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-3">
          Todo Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Organize your tasks and boost your productivity
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-white to-gray-50 p-8 border-2 border-primary/10 rounded-3xl shadow-xl backdrop-blur-sm"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create New Task</h2>
          <p className="text-muted-foreground">Add a new task to your list</p>
        </div>
        <TaskForm />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Tasks</h2>
            <p className="text-muted-foreground">Manage your active tasks</p>
          </div>
        </div>
        <TaskList />
      </motion.section>
    </motion.div>
  );
}
