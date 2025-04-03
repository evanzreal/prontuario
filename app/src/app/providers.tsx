'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

// Provedor de sessão com monitoramento
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={300} refetchOnWindowFocus={true}>
      <SessionMonitor />
      {children}
    </SessionProvider>
  );
}

// Componente para monitorar o estado da sessão
function SessionMonitor() {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    console.log('📊 Status da sessão:', status, session?.user?.email ? `(${session.user.email})` : '');
  }, [session, status]);
  
  return null;
} 