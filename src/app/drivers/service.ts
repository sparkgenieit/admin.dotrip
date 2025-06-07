// service.ts

import { Driver, Vehicle } from './types';
import { API_BASE_URL } from '@/lib/constants';

const DRIVERS_URL  = `${API_BASE_URL}/admin/drivers`;
const VEHICLES_URL = `${API_BASE_URL}/admin/vehicles`;

function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchDrivers(): Promise<Driver[]> {
  const token = getToken();
  const res = await fetch(DRIVERS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch drivers');
  return res.json();
}

export async function fetchDriver(id: number): Promise<Driver> {
  const token = getToken();
  const res = await fetch(`${DRIVERS_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch driver details');
  return res.json();
}

export async function addDriver(d: Omit<Driver,'id'>): Promise<Driver> {
  const token = getToken();
  const res = await fetch(`${DRIVERS_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(d),
  });
  if (!res.ok) throw new Error('Failed to add driver');
  return res.json();
}

export async function updateDriver(id: number, d: Partial<Omit<Driver,'id'>>): Promise<Driver> {
  const token = getToken();
  const res = await fetch(`${DRIVERS_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(d),
  });
  if (!res.ok) throw new Error('Failed to update driver');
  return res.json();
}

export async function deleteDriver(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${DRIVERS_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete driver');
}

export async function fetchVehicles(filters: { vendorId?: number; driverId?: number } = {}): Promise<Vehicle[]> {
  const token = getToken();
  const params = new URLSearchParams();
  if (filters.vendorId != null) params.set('vendorId', String(filters.vendorId));
  if (filters.driverId != null) params.set('driverId', String(filters.driverId));
  const url = params.toString() ? `${VEHICLES_URL}?${params}` : VEHICLES_URL;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}
