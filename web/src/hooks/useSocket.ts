import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const s = io(window.location.origin, { transports: ['websocket'] });
    setSocket(s);
    return () => {
      s.close();
    };
  }, []);

  return socket;
}
