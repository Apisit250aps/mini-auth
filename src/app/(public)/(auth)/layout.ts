'use client';
import { useSession } from '@/shared/hooks/session-provider';
import { redirect } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === 'authenticated') return redirect('/');
  return children;
}
