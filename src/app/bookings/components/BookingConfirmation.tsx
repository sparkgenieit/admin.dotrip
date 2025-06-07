// src/app/bookings/components/BookingConfirmation.tsx
'use client';

import React from 'react';

interface BookingConfirmationProps {
  bookingDetails: {
    pickupDateTime: string;   // e.g. "2025-06-10 14:30"
    fare: number;             // e.g. 1700
    pickupAddress: string;    // e.g. "Hyderabad, Telangana"
    dropAddress: string;      // e.g. "Mumbai, Maharashtra"
  };
  selectedCar: {
    name: string;
    price: number;
    image: string;
  };
}

export default function BookingConfirmation({
  bookingDetails,
  selectedCar,
}: BookingConfirmationProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
        <p className="text-gray-600">Thank you for your booking.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-md">
          <h4 className="font-semibold mb-2">Trip Details</h4>
          <p>
            <span className="font-semibold">Pickup Time:</span>{' '}
            {bookingDetails.pickupDateTime}
          </p>
          <p>
            <span className="font-semibold">Pickup Address:</span>{' '}
            {bookingDetails.pickupAddress}
          </p>
          <p>
            <span className="font-semibold">Drop Address:</span>{' '}
            {bookingDetails.dropAddress}
          </p>
          <p>
            <span className="font-semibold">Fare:</span> ₹ {bookingDetails.fare}
          </p>
        </div>
        <div className="p-4 border rounded-md text-center">
          <h4 className="font-semibold mb-2">Vehicle Details</h4>
          <img
            src={`cars/${selectedCar.image}`}
            alt={selectedCar.name}
            className="mx-auto h-40 object-cover rounded-md mb-3"
          />
          <p className="font-semibold">{selectedCar.name}</p>
          <p>Price: ₹ {selectedCar.price} / hr</p>
        </div>
      </div>
    </div>
  );
}
