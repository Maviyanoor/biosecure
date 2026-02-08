'use client';

import { ReactNode, useEffect, useState } from 'react';
import AIChatbot from '../widgets/AIChatbot';

interface ClientWrapperProps {
  children: ReactNode;
  showChatbot?: boolean;
}

export default function ClientWrapper({ children, showChatbot = true }: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {children}
      {isClient && showChatbot && <AIChatbot />}
    </>
  );
}