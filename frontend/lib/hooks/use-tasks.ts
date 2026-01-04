import useSWR from 'swr';
import { useSession } from '@/lib/auth';

export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const fetcher = async (url: string, userId: string) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'x-user-id': userId,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export function useTasks() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, error, mutate } = useSWR<Task[]>(
    userId ? [`/tasks`, userId] : null,
    ([url, id]) => fetcher(url, id as string)
  );

  const addTask = async (title: string, description: string) => {
    if (!userId) return;

    const newTask = {
      title,
      description,
    };

    // Optimistic update
    const optimisticTask: Task = {
      id: Math.random(), // Temporary ID
      title,
      description,
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    mutate((currentTasks) => [optimisticTask, ...(currentTasks || [])], false);

    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error('Failed to create task');
      mutate(); // Revalidate from server
    } catch (err) {
      mutate(); // Rollback optimistic update
      throw err;
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!userId) return;

    mutate((currentTasks) => currentTasks?.filter(t => t.id !== taskId), false);

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId,
        },
      });

      if (!res.ok) throw new Error('Failed to delete task');
      mutate();
    } catch (err) {
      mutate();
      throw err;
    }
  };

  const toggleTaskStatus = async (taskId: number, currentStatus: boolean) => {
    if (!userId) return;

    mutate(
      (currentTasks) =>
        currentTasks?.map((t) =>
          t.id === taskId ? { ...t, is_completed: !currentStatus } : t
        ),
      false
    );

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ is_completed: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update task status');
      mutate();
    } catch (err) {
      mutate();
      throw err;
    }
  };

  const updateTask = async (taskId: number, updates: { title?: string; description?: string }) => {
    if (!userId) return;

    mutate(
      (currentTasks) =>
        currentTasks?.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      false
    );

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to update task');
      mutate();
    } catch (err) {
      mutate();
      throw err;
    }
  };

  return {
    tasks: data || [],
    isLoading: !error && !data,
    isError: error,
    addTask,
    deleteTask,
    toggleTaskStatus,
    updateTask,
  };
}
