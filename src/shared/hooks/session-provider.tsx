'use client';
import { jwtClient, oneTapClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import React, { useMemo } from 'react';
import { createContext } from 'react';

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    jwtClient(),
    oneTapClient({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    }),
  ],
});

type SessionState = {
  data: ReturnType<typeof authClient.useSession>['data'];
  status: 'loading' | 'authenticated' | 'unauthenticated' | string;
};

type SessionAction = {
  signOut: typeof authClient.signOut;
  signIn: typeof authClient.signIn;
  signUp: typeof authClient.signUp;
};

type SessionContext = SessionState & SessionAction;

const SessionContext = createContext<SessionContext | null>(null);

function SessionProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();

  const { data, status } = useMemo(() => {
    if (!session.isPending) {
      if (!session.data) {
        return {
          data: null,
          status: 'unauthenticated',
        };
      }
      return {
        data: session.data,
        status: 'authenticated',
      };
    }

    return {
      data: null,
      status: 'loading',
    };
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        data,
        status,
        signIn: authClient.signIn,
        signUp: authClient.signUp,
        signOut: authClient.signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export { SessionProvider, useSession };
