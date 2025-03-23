'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from './providers/AuthProvider';
import { useEffect } from 'react';
import LoadingScreen from './loadingScreen/LoadingScreen';
import Header from './feed/components/Header'; // Import Header component

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/feed');
      } else {
        router.push('/auth');
      }
    }
  }, [user, loading, router]);

  return (
    <>

    </>
  );
}
