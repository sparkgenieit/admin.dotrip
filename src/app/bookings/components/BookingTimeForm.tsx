// src/app/bookings/components/BookingTimeForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { City, TripType, BookingData } from '../types';

interface BookingTimeFormProps {
  onBookingDetailsChange: (data: BookingData) => void;
  initialData?: BookingData;
  allCities: City[];
  allTripTypes: TripType[];
}

export default function BookingTimeForm({
  onBookingDetailsChange,
  initialData,
  allCities,
  allTripTypes,
}: BookingTimeFormProps) {
  // ─── (1) TRIP TYPE STATE ────────────────────────────────────────────────
  const [tripTypeId, setTripTypeId] = useState<number>(
    initialData ? initialData.tripTypeId : allTripTypes.length > 0 ? allTripTypes[0].id : 0
  );

  // ─── (2) LOCATION / DATE / TIME STATES ──────────────────────────────────
  const [pickupLocation, setPickupLocation] = useState<string>(
    initialData ? initialData.pickupLocation : ''
  );
  const [pickupCityId, setPickupCityId] = useState<number | null>(
    initialData ? initialData.pickupCityId : null
  );
  const [dropLocation, setDropLocation] = useState<string>(
    initialData ? initialData.dropLocation : ''
  );
  const [dropCityId, setDropCityId] = useState<number | null>(
    initialData ? initialData.dropCityId : null
  );
  const [pickupDate, setPickupDate] = useState<string>(
    initialData ? initialData.pickupDate : '2025-05-05'
  );
  const [pickupTime, setPickupTime] = useState<string>(
    initialData ? initialData.pickupTime : '07:00'
  );

  // ─── (3) AUTOCOMPLETE STATES ─────────────────────────────────────────────
  const [showPickupSuggestions, setShowPickupSuggestions] = useState<boolean>(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ pickup?: string; drop?: string }>({});

  // ─── (4) FILTERED LISTS BASED ON USER INPUT ──────────────────────────────
  const filteredPickup = showPickupSuggestions
    ? allCities.filter((city) =>
        `${city.name}, ${city.state}`.toLowerCase().includes(pickupLocation.toLowerCase())
      )
    : [];

  const filteredDrop = showDropSuggestions
    ? allCities.filter((city) =>
        `${city.name}, ${city.state}`.toLowerCase().includes(dropLocation.toLowerCase())
      )
    : [];

  // ─── (5) HANDLE FORM SUBMIT ─────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!pickupLocation) newErrors.pickup = 'Pickup location required';
    if (!dropLocation) newErrors.drop = 'Drop location required';
    if (pickupCityId === null) newErrors.pickup = 'Please select a valid pickup city';
    if (dropCityId === null) newErrors.drop = 'Please select a valid drop city';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onBookingDetailsChange({
        tripTypeId,
        pickupLocation,
        pickupCityId: pickupCityId!,
        dropLocation,
        dropCityId: dropCityId!,
        pickupDate,
        pickupTime,
      });
    }
  }

  return (
    <div>
      <form className="grid md:grid-cols-6 gap-4" onSubmit={handleSubmit}>
        {/* Trip Type */}
        <div className="col-span-2">
          <label className="block text-sm font-medium">TRIP TYPE</label>
          <select
            value={tripTypeId}
            onChange={(e) => setTripTypeId(parseInt(e.target.value, 10))}
            className="w-full border rounded px-3 py-2"
          >
            {allTripTypes.map((tt) => (
              <option key={tt.id} value={tt.id}>
                {tt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pickup */}
        <div className="col-span-2 relative">
          <label className="block text-sm font-medium">FROM</label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => {
              setPickupLocation(e.target.value);
              setPickupCityId(null);
            }}
            onFocus={() => setShowPickupSuggestions(true)}
            onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 100)}
            className="w-full border rounded px-3 py-2"
            placeholder="Pickup location"
          />
          {errors.pickup && <p className="text-red-600 text-xs mt-1">{errors.pickup}</p>}
          {showPickupSuggestions && (
            <ul className="absolute z-50 bg-white border w-full max-h-40 overflow-y-auto">
              {filteredPickup.map((city) => {
                const display = `${city.name}, ${city.state}`;
                return (
                  <li
                    key={city.id}
                    onMouseDown={() => {
                      setPickupLocation(display);
                      setPickupCityId(city.id);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {display}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Drop */}
        <div className="col-span-2 relative">
          <label className="block text-sm font-medium">TO</label>
          <input
            type="text"
            value={dropLocation}
            onChange={(e) => {
              setDropLocation(e.target.value);
              setDropCityId(null);
            }}
            onFocus={() => setShowDropSuggestions(true)}
            onBlur={() => setTimeout(() => setShowDropSuggestions(false), 100)}
            className="w-full border rounded px-3 py-2"
            placeholder="Drop location"
          />
          {errors.drop && <p className="text-red-600 text-xs mt-1">{errors.drop}</p>}
          {showDropSuggestions && (
            <ul className="absolute z-50 bg-white border w-full max-h-40 overflow-y-auto">
              {filteredDrop.map((city) => {
                const display = `${city.name}, ${city.state}`;
                return (
                  <li
                    key={city.id}
                    onMouseDown={() => {
                      setDropLocation(display);
                      setDropCityId(city.id);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {display}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-medium">DATE</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Pickup Time */}
        <div>
          <label className="block text-sm font-medium">TIME</label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-6">
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md"
          >
            Search Cabs
          </button>
        </div>
      </form>
    </div>
  );
}
