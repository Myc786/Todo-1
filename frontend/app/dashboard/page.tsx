'use client';

import { TaskList } from '@/components/tasks/task-list';
import { TaskForm } from '@/components/tasks/task-form';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Create New Task
          </h3>
          <TaskForm />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Tasks</h2>
        </div>
        <TaskList />
      </section>
    </div>
  );
}