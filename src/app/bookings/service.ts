// src/app/bookings/service.ts

import { API_BASE_URL } from '@/lib/constants';

//
// ─── (A) UTILITY TO RETRIEVE THE AUTH TOKEN ──────────────────────────────────
//
function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

// ─── NEW: Fetch all bookings ─────────────────────────────────────────────────
export async function fetchAllBookings(): Promise<any[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}


//
// ─── (B) CITY ENDPOINTS ──────────────────────────────────────────────────────
//
export async function fetchCities(): Promise<{ id: number; name: string; state: string }[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/cities`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

//
// ─── (C) TRIP‐TYPE ENDPOINTS ──────────────────────────────────────────────────
//
export async function fetchTripTypes(): Promise<{ id: number; label: string }[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/trip-types`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch trip types');
  return res.json();
}

//
// ─── (D) VEHICLE ENDPOINTS ───────────────────────────────────────────────────
//
export async function fetchVehicles(): Promise<any[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/vehicles`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

//
// ─── (E) ADDRESS ENDPOINTS ───────────────────────────────────────────────────
//
export async function createAddress(data: {
  userId: number;
  type: 'PICKUP' | 'DROP';
  address: string;
}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      userId: data.userId,
      type: data.type,
      address: data.address.trim(),
    }),
  });
  if (!res.ok) throw new Error(`Failed to create ${data.type} address`);
  return res.json();
}

export async function fetchAddressById(addressId: string): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch address #${addressId}`);
  return res.json();
}

//
// ─── (F) BOOKING ENDPOINTS ───────────────────────────────────────────────────
//

// Fetch a single booking by its primary key
export async function fetchBookingById(bookingId: number): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch booking #${bookingId}`);
  return res.json();
}

// Fetch all bookings
export async function fetchBookings(): Promise<any[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

// Create a new booking
export async function createBooking(data: {
  userId: number;
  vehicleId: number;
  fromCityId: number;
  toCityId: number;
  pickupAddressId: string;
  dropAddressId: string;
  pickupDateTime: string;
  tripTypeId: number;
  fare: number;
}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

// Update an existing booking
export async function updateBooking(
  bookingId: number,
  data: Partial<{
    vehicleId: number;
    fromCityId: number;
    toCityId: number;
    pickupAddressId: string;
    dropAddressId: string;
    pickupDateTime: string;
    tripTypeId: number;
    fare: number;
  }>
): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update booking #${bookingId}`);
  return res.json();
}

// Delete a booking
export async function deleteBooking(bookingId: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error(`Failed to delete booking #${bookingId}`);
  return;
}

//
// ─── (G) USER & EMAIL CHECK ENDPOINTS ────────────────────────────────────────
//
export async function checkEmail(email: string): Promise<{ exists: boolean; user?: any }> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/admin/users/check-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ email: email.trim() }),
  });
  if (!res.ok) throw new Error('Failed to check email');
  return res.json();
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
    }),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

//
// ─── (H) AUTOCOMPLETE (PLACES) ENDPOINT ──────────────────────────────────────
//
export async function fetchPlaceAutocomplete(
  input: string,
  sessiontoken: string
): Promise<{ description: string; place_id: string }[]> {
  const token = getToken();
  const encoded = encodeURIComponent(input);
  const res = await fetch(
    `${API_BASE_URL}/places/autocomplete?input=${encoded}&sessiontoken=${sessiontoken}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch place suggestions');
  return res.json();
}

export async function fetchUserById(userId: number): Promise<{ id: number; name: string; email: string; phone: string }> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch user #${userId}`);
  return res.json();
}
