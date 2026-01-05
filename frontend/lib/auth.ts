import { useState, useEffect } from 'react';

// Placeholder auth implementation - replace with actual auth when backend is properly configured
export const signIn = {
  email: async ({ email, password, callbackURL }: { email: string; password: string; callbackURL?: string }) => {
    // For development, we'll simulate a user session
    const mockUser = {
      id: "1",
      name: "Test User",
      email,
    };

    // Store in localStorage for now
    const previousUser = localStorage.getItem('mock-user');
    localStorage.setItem('mock-user', JSON.stringify(mockUser));

    // Dispatch a storage event to notify other components in the same tab
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'mock-user',
      oldValue: previousUser,
      newValue: JSON.stringify(mockUser),
      url: window.location.href,
      storageArea: localStorage
    }));

    // If callbackURL is provided, we could redirect, but for now just return the user
    return mockUser;
  }
};

export const signUp = {
  email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
    // For development, we'll simulate a user session
    const mockUser = {
      id: "1",
      name: name || "Test User",
      email,
    };

    // Store in localStorage for now
    const previousUser = localStorage.getItem('mock-user');
    localStorage.setItem('mock-user', JSON.stringify(mockUser));

    // Dispatch a storage event to notify other components in the same tab
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'mock-user',
      oldValue: previousUser,
      newValue: JSON.stringify(mockUser),
      url: window.location.href,
      storageArea: localStorage
    }));

    return mockUser;
  }
};

export const signOut = async () => {
  const previousUser = localStorage.getItem('mock-user');
  localStorage.removeItem('mock-user');

  // Dispatch a storage event to notify other components in the same tab
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'mock-user',
    oldValue: previousUser,
    newValue: null,
    url: window.location.href,
    storageArea: localStorage
  }));
};

// Simple function to get session data (not a React hook)
export const getSession = () => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('mock-user') || 'null');
    return user ? { user } : null;
  }
  return null;
};

export const useSession = () => {
  // Initialize state - will be null on server, and will update after hydration
  const [user, setUser] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      // Get initial user from localStorage
      const storedUser = JSON.parse(localStorage.getItem('mock-user') || 'null');
      setUser(storedUser);

      // Mark as hydrated after getting initial state
      setIsHydrated(true);

      const handleStorageChange = () => {
        const updatedUser = JSON.parse(localStorage.getItem('mock-user') || 'null');
        setUser(updatedUser);
      };

      // Listen for changes to localStorage from other tabs/windows
      window.addEventListener('storage', handleStorageChange);

      // Clean up the event listener
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  // Determine status based on user and hydration state
  const status = !isHydrated ? 'unauthenticated' : user ? 'authenticated' : 'unauthenticated';
  const isPending = !isHydrated;

  return {
    data: user ? { user } : null,
    status,
    isPending,
    // Add a manual refresh function for same-tab updates
    refresh: () => {
      if (typeof window !== 'undefined') {
        const updatedUser = JSON.parse(localStorage.getItem('mock-user') || 'null');
        setUser(updatedUser);
      }
    }
  };
};
