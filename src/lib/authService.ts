import { API_BASE_URL } from '@/lib/constants';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  const data = await response.json();
  console.log(data);
  if (data.access_token) {
    localStorage.setItem('authToken', data.access_token);
  }

  return data;
}

export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}
