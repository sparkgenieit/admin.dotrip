// src/app/bookings/components/BookingList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchAllBookings } from '../service';
import { City, TripType, Vehicle, FullBooking } from '../types';

interface BookingListProps {
  allCities: City[];
  allTripTypes: TripType[];
  allVehicles: Vehicle[];
  refreshSignal: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
} 

export default React.memo(function BookingList({
  allCities,
  allTripTypes,
  allVehicles,
  refreshSignal,
  onEdit,
  onDelete,
}: BookingListProps) {
  const [bookings, setBookings] = useState<FullBooking[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(true);
  const [listError, setListError] = useState<string | null>(null);

  // Re-fetch whenever refreshSignal changes
  useEffect(() => {
    async function loadBookings() {
      setListLoading(true);
      try {
        const data: FullBooking[] = await fetchAllBookings();
        setBookings(data);
        setListError(null);
      } catch (err: any) {
        console.error('Error fetching all bookings:', err);
        setListError(err.message || 'Failed to load bookings list');
      }
      setListLoading(false);
    }
    loadBookings();
  }, [refreshSignal]);

  if (listLoading) {
    return <div>Loading all bookings…</div>;
  }
  if (listError) {
    return <div className="text-red-600">Error: {listError}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left">S. No</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Trip Type</th>
              <th className="border border-gray-300 px-3 py-2 text-left">From City</th>
              <th className="border border-gray-300 px-3 py-2 text-left">To City</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Vehicle</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Date & Time</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Fare</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, idx) => {
              // Look up the “label” or “name” by ID, falling back to raw ID if missing
              const tripTypeName =
                allTripTypes.find((tt) => tt.id === b.tripTypeId)?.label || String(b.tripTypeId);
              const fromCityName =
                allCities.find((c) => c.id === b.fromCityId)?.name || String(b.fromCityId);
              const toCityName =
                allCities.find((c) => c.id === b.toCityId)?.name || String(b.toCityId);
              const vehicleName =
                allVehicles.find((v) => v.id === b.vehicleId)?.name || String(b.vehicleId);

              // Format pickupDateTime as “YYYY-MM-DD HH:mm”
              const dt = new Date(b.pickupDateTime);
              const yyyy = dt.getFullYear().toString().padStart(4, '0');
              const mm = (dt.getMonth() + 1).toString().padStart(2, '0');
              const dd = dt.getDate().toString().padStart(2, '0');
              const hh = dt.getHours().toString().padStart(2, '0');
              const mi = dt.getMinutes().toString().padStart(2, '0');
              const formattedDT = `${yyyy}-${mm}-${dd} ${hh}:${mi}`;

              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">{idx + 1}</td>
                  <td className="border border-gray-300 px-3 py-2">{tripTypeName}</td>
                  <td className="border border-gray-300 px-3 py-2">{fromCityName}</td>
                  <td className="border border-gray-300 px-3 py-2">{toCityName}</td>
                  <td className="border border-gray-300 px-3 py-2">{vehicleName}</td>
                  <td className="border border-gray-300 px-3 py-2">{formattedDT}</td>
                  <td className="border border-gray-300 px-3 py-2">{b.fare}</td>
                  <td className="border border-gray-300 px-3 py-2 space-x-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-sm"
                      onClick={() => onEdit(b.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-sm"
                      onClick={() => onDelete(b.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
