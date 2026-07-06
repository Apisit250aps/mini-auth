'use client';

import { useSession } from '@/shared/hooks/session-provider';
import React from 'react';

export default function Page() {
  const { data: session, signOut } = useSession();

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
