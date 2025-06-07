
// Types related to admin booking if needed
// src/app/bookings/types.ts

// ─── (A) City ────────────────────────────────────────────────────────────────
export interface City {
  id: number;
  name: string;
  state: string;
}

// ─── (B) TripType ─────────────────────────────────────────────────────────────
export interface TripType {
  id: number;
  label: string;
}

// ─── (C) Vehicle ──────────────────────────────────────────────────────────────
// This matches the shape returned by GET /vehicles
export interface Vehicle {
  id: number;
  name: string;
  description: string;
  price: number;            // e.g. price per hour
  image: string;            // filename or URL
  price_per_hour: number;   // if returned by your API
  price_per_km: number;     // if returned by your API
}

// ─── (D) Address ──────────────────────────────────────────────────────────────
// This matches the shape returned by GET /addresses/:id
export interface Address {
  id: string;
  address: string;
  lat_long?: string;
  // other fields if your API returns them
}

// ─── (E) BookingData (used by BookingTimeForm) ─────────────────────────────────
export interface BookingData {
  tripTypeId: number;
  pickupLocation: string;   // e.g. "Hyderabad, Telangana"
  pickupCityId: number;
  dropLocation: string;     // e.g. "Mumbai, Maharashtra"
  dropCityId: number;
  pickupDate: string;       // e.g. "2025-06-10"
  pickupTime: string;       // e.g. "14:30"
}

// ─── (F) BookingDetailsFromForm (alias) ────────────────────────────────────────
export type BookingDetailsFromForm = BookingData;

// ─── (G) Full Booking (returned by GET /bookings/:id) ──────────────────────────
export interface FullBooking {
  id: number;
  userId: number;
  vehicleId: number;
  fromCityId: number;
  toCityId: number;
  pickupAddressId: string;
  dropAddressId: string;
  pickupDateTime: string;   // ISO string, e.g. "2025-05-05T07:00:00.000Z"
  tripTypeId: number;
  fare: number;
  createdAt: string;
  // plus you might also get nested relations if your back end includes them
}

/** User fetched from /admin/users/:id (for prefilling) */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}