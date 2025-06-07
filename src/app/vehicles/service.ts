// src/app/vehicles/service.ts

import { Vehicle } from './types';
import { API_BASE_URL } from '@/lib/constants';

const VEHICLES_URL = `${API_BASE_URL}/admin/vehicles`;

function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}
export async function checkRegistrationNumber(params: URLSearchParams): Promise<any> {
  const token = getToken();

  const res = await fetch(`${VEHICLES_URL}/check-registration?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to check registration');
  return await res.json();
}


// Fetch vehicles with optional filters
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

// Fetch single vehicle by ID
export async function fetchVehicle(id: number): Promise<Vehicle> {
  const token = getToken();
  const res = await fetch(`${VEHICLES_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch vehicle details');
  return res.json();
}

// Create a new vehicle
export async function addVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  const token = getToken();
  const res = await fetch(VEHICLES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add vehicle');
  return res.json();
}

// Update an existing vehicle
export async function updateVehicle(id: number, data: Partial<Omit<Vehicle, 'id'>>): Promise<Vehicle> {
  const token = getToken();
  const res = await fetch(`${VEHICLES_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update vehicle');
  return res.json();
}

// Delete a vehicle by ID
export async function deleteVehicle(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${VEHICLES_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete vehicle');
}
