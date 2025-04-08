'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function Dashboard() {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [data, setData] = useState<{ items: { id: string; name: string; description: string }[]; user_id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isUserLoaded && user) {
      fetchProtectedData();
    }
  }, [isUserLoaded, user]);

  const fetchProtectedData = async () => {
    try {
      setLoading(true);
      // Get JWT token from Clerk
      const token = await getToken();
      
      // Fetch protected data from Flask backend
      const response = await fetch('http://localhost:5000/api/protected-resource', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch protected data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isUserLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6">Welcome, {user?.firstName}!</p>
        
        <h2 className="text-xl font-bold mb-2">Protected Resource Data</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : data ? (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold">Items:</h3>
            <ul className="list-disc pl-8">
              {data.items.map(item => (
                <li key={item.id}>
                  <strong>{item.name}</strong>: {item.description}
                </li>
              ))}
            </ul>
            <p className="mt-2">User ID: {data.user_id}</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}