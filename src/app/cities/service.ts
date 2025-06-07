import { City } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/cities`;



/**
 * Retrieve the auth token from localStorage
 */
function getToken() {
  console.log(localStorage.getItem('authToken'));
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchCities(): Promise<City[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

export async function addCity(data: Omit<City, 'id'>): Promise<City> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add city');
  return res.json();
}

export async function updateCity(id: number, data: Omit<City, 'id'>): Promise<City> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update city');
  return res.json();
}

export async function deleteCity(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete city');
}
