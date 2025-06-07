// src/hooks/useUser.ts
import { useState, useEffect } from 'react';

interface JWTPayload {
  role?: string;
  [key: string]: any;
}

function parseJwt(token: string): JWTPayload | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function useUser() {
  const [role, setRole] = useState<string>('');
    const [id, setId] = useState<number>(0);


  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('authToken')
      : null;
    if (token) {
      const payload = parseJwt(token); console.log(payload);
      if (payload?.role) setRole(payload.role);
      setId(payload.sub);
    }
  }, []);

  return { id,role };
}
