'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // Check if mock user exists in localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('mock-user');
      if (!storedUser) {
        // Create a mock user for development
        const mockUser = {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        };
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
      }

      // Wait a bit longer to ensure the session state updates before redirecting
      const timer = setTimeout(() => {
        router.push('/dashboard');
        setCheckedAuth(true);
      }, 300); // Increased delay to ensure session state updates

      return () => clearTimeout(timer);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

