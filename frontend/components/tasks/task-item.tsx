'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, useTasks } from '@/lib/hooks/use-tasks';
import { Trash2, CheckCircle, Circle, Edit2, X, Check, CheckCheck } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { deleteTask, toggleTaskStatus, updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleToggle = async () => {
    try {
      await toggleTaskStatus(task.id, task.is_completed);
    } catch (err) {
      console.error('Failed to toggle task status:', err);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    try {
      await updateTask(task.id, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-4 border-2 border-primary/20 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/80 backdrop-blur-sm transition-all"
                placeholder="Task title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/80 backdrop-blur-sm text-sm resize-none transition-all"
                placeholder="Description (optional)"
                rows={2}
              />
              <div className="flex justify-end gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 border-2 border-muted-foreground/30 rounded-lg hover:bg-muted transition-colors bg-white/70 backdrop-blur-sm"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-5 border-2 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300 ${
              task.is_completed
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
                : 'bg-gradient-to-br from-white to-gray-50 border-border/50 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggle}
                className={`flex-shrink-0 transition-all duration-300 ${
                  task.is_completed ? 'text-green-600' : 'text-muted-foreground hover:text-primary'
                }`}
                title={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
              >
                <motion.div
                  animate={{ rotate: task.is_completed ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {task.is_completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCheck className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </motion.div>
              </motion.button>

              <div className="flex-1 min-w-0">
                <motion.h3
                  className={`font-semibold text-lg break-words transition-all duration-300 ${
                    task.is_completed
                      ? 'line-through text-muted-foreground/80'
                      : 'text-foreground'
                  }`}
                  animate={{
                    color: task.is_completed ? '#6b7280' : '#1f2937'
                  }}
                >
                  {task.title}
                </motion.h3>

                {task.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm mt-2 break-words transition-all ${
                      task.is_completed
                        ? 'text-muted-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {task.description}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 mt-3 text-xs text-muted-foreground"
                >
                  <span className="px-2 py-1 bg-muted/50 rounded-full">
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </span>
                  {task.is_completed && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full"
                    >
                      Completed
                    </motion.span>
                  )}
                </motion.div>
              </div>

              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors bg-muted/30 backdrop-blur-sm"
                  title="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors bg-muted/30 backdrop-blur-sm"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
