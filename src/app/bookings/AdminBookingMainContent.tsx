// src/app/bookings/AdminBookingMainContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import BookingTimeForm from './components/BookingTimeForm';
import SelectCarsPage from './components/SelectCarsPage';
import BookingConfirmation from './components/BookingConfirmation';
// Import the newly extracted BookingList component:
import BookingList from './components/BookingList';

import {
  fetchBookingById,
  fetchCities,
  fetchTripTypes,
  fetchVehicles,
  fetchAddressById,
  fetchAllBookings,
  deleteBooking,
  fetchUserById, // NEW
} from './service';

import {
  City,
  TripType,
  Vehicle,
  Address,
   User,
  BookingDetailsFromForm,
  FullBooking,
} from './types';

export default function AdminBookingMainContent() {
  // ─── (0) STATE: Controls whether the Add/Edit form is visible
  const [showForm, setShowForm] = useState<boolean>(false);

  // ─── (1) STATE: existingBookingId (0 = “Add New Booking”; >0 = “Edit”)
  const [existingBookingId, setExistingBookingId] = useState<number>(0);

  // ─── (2) STATE: “Raw” data from BookingTimeForm
  const [bookingDetailsRaw, setBookingDetailsRaw] =
    useState<BookingDetailsFromForm | null>(null);

  // ─── (3) STATE: Selected Vehicle object in SelectCarsPage
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);

  // ─── (4) STATE: Show/hide “Select Car” step
  const [showSelectCars, setShowSelectCars] = useState<boolean>(false);

  // ─── (5) STATE: Whether the contact/address form has been submitted
  const [bookingFormFilled, setBookingFormFilled] = useState<boolean>(false);

  // ─── (6) STATE: Loading / error flags for initial data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ─── (7) STATE: Lookup tables for dropdowns & prefill
  const [allCities, setAllCities] = useState<City[]>([]);
  const [allTripTypes, setAllTripTypes] = useState<TripType[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  // ─── (8) STATE: Prefill specific Address entries for pickup & drop
  const [initialPickupAddress, setInitialPickupAddress] = useState<Address | null>(null);
  const [initialDropAddress, setInitialDropAddress] = useState<Address | null>(null);

  // ─── (9) STATE: A simple “signal” counter to force BookingList to reload
  const [refreshSignal, setRefreshSignal] = useState<number>(0);
// ─── (9) STATE: Prefill User data (name/email/phone) using booking.userId
  const [initialUser, setInitialUser] = useState<User | null>(null);

  // ─── (10) On mount OR whenever existingBookingId changes, load lookups and optionally the booking
  useEffect(() => {
    async function loadAllData() {
      setIsLoading(true);
      try {
        // 10.1) Fetch cities, trip types, and vehicles in parallel
        const [cities, tripTypes, vehicles] = await Promise.all([
          fetchCities(),
          fetchTripTypes(),
          fetchVehicles(),
        ]);
        setAllCities(cities);
        setAllTripTypes(tripTypes);
        setAllVehicles(vehicles);

        // 10.2) If editing (existingBookingId > 0), fetch that booking & prefill
        if (existingBookingId > 0) {
          const booking: FullBooking = await fetchBookingById(existingBookingId);

          // Convert booking.pickupDateTime (ISO) into date + time
          const dt = new Date(booking.pickupDateTime);
          const yyyy = dt.getFullYear().toString().padStart(4, '0');
          const mm = (dt.getMonth() + 1).toString().padStart(2, '0');
          const dd = dt.getDate().toString().padStart(2, '0');
          const hh = dt.getHours().toString().padStart(2, '0');
          const mi = dt.getMinutes().toString().padStart(2, '0');

          // Find City objects to build “City, State”
          const pickupCityObj = cities.find((c) => c.id === booking.fromCityId);
          const dropCityObj = cities.find((c) => c.id === booking.toCityId);

          const rawPrefill: BookingDetailsFromForm = {
            tripTypeId: booking.tripTypeId,
            pickupLocation: pickupCityObj
              ? `${pickupCityObj.name}, ${pickupCityObj.state}`
              : '',
            pickupCityId: booking.fromCityId,
            dropLocation: dropCityObj
              ? `${dropCityObj.name}, ${dropCityObj.state}`
              : '',
            dropCityId: booking.toCityId,
            pickupDate: `${yyyy}-${mm}-${dd}`, // “YYYY-MM-DD”
            pickupTime: `${hh}:${mi}`, // “HH:mm”
          };
          setBookingDetailsRaw(rawPrefill);

          // Preselect the correct Vehicle object
          const vehicleObj = vehicles.find((v) => v.id === booking.vehicleId) || null;
          setSelectedCar(vehicleObj);

          // Fetch pickup & drop addresses for prefill
          const [pickupAddr, dropAddr] = await Promise.all([
            fetchAddressById(booking.pickupAddressId),
            fetchAddressById(booking.dropAddressId),
          ]);
          setInitialPickupAddress(pickupAddr);
          setInitialDropAddress(dropAddr);
// 10.2.6) Fetch the user data by booking.userId and prefill
          const fetchedUser: User = await fetchUserById(booking.userId);
          setInitialUser(fetchedUser);
          // Show the “Select Cars” step immediately
          setShowSelectCars(true);
        } else {
          // If returning to “Add” mode from “Edit,” clear any prior prefill state
          setBookingDetailsRaw(null);
          setSelectedCar(null);
          setInitialPickupAddress(null);
          setInitialDropAddress(null);
          setShowSelectCars(false);
           setInitialUser(null);
          setBookingFormFilled(false);
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setLoadError(err.message || 'Failed to load booking or lookups');
        setIsLoading(false);
      }
    }

    loadAllData();
  }, [existingBookingId]);

  // ─── (A) CALLBACK: When BookingTimeForm emits its data (after “Search Cabs”)
  function handleBookingDetailsChange(data: BookingDetailsFromForm) {
    setBookingDetailsRaw(data);
    setShowSelectCars(true);
    setSelectedCar(null);
    setBookingFormFilled(false);
  }

  // ─── (B) CALLBACK: When SelectCarsPage emits a vehicle selection
  function handleCarSelect(car: Vehicle) {
    setSelectedCar(car);
  }

  // ─── (C) CALLBACK: When the contact/address form inside SelectCarsPage is submitted
  function handleFormComplete() {
    setBookingFormFilled(true);
  }

  // ─── (D) RENDER LOADING / ERROR STATES ─────────────────────────────────────
  if (isLoading) {
    return <div>Loading booking data…</div>;
  }
  if (loadError) {
    return <div className="text-red-600">Error: {loadError}</div>;
  }

  // Decide whether we are “Add New Booking” (existingBookingId=0) or “Edit”
  const isEditMode = existingBookingId > 0;

  return (
    <div className="p-6 space-y-8">
      {/* ─── (1) SHOW “Add Booking” BUTTON if showForm===false ──────────────────── */}
      {!showForm && (
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          onClick={() => {
            setExistingBookingId(0); // ensures we’re in “Add” mode
            setShowForm(true);
          }}
        >
          Add Booking
        </button>
      )}

      {/* ─── (2) ADD/EDIT FORM: Only render if showForm===true ─────────────────── */}
      {showForm && (
        <>
          {isEditMode ? (
            <div className="border rounded-md p-4 bg-yellow-50">
              <h2 className="text-xl font-bold mb-3">
                EDIT Booking # {existingBookingId}
              </h2>
              <p className="text-gray-700 mb-4">
                Below is a prefilled form loaded from booking record #{existingBookingId}.{' '}
                Make changes as needed, then click “Save Changes” or “Cancel.”
              </p>

              {/* STEP 1 (Prefilled): Search Cabs */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  1) Search Cabs (Prefilled)
                </h3>
                {bookingDetailsRaw ? (
                  <BookingTimeForm
                    onBookingDetailsChange={handleBookingDetailsChange}
                    initialData={bookingDetailsRaw}
                    allCities={allCities}
                    allTripTypes={allTripTypes}
                  />
                ) : (
                  <p className="text-gray-500">Loading booking details…</p>
                )}
              </div>

              {/* STEP 2 (Prefilled): Select Car */}
              {showSelectCars && bookingDetailsRaw &&  initialUser && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                     Select Car (Prefilled)
                  </h3>
                  <SelectCarsPage
                    bookingDetails={bookingDetailsRaw}
                    onCarSelect={handleCarSelect}
                    onFormComplete={handleFormComplete}
                    initialSelectedCar={selectedCar}
                    allVehicles={allVehicles}
                    initialPickupAddress={initialPickupAddress!}
                    initialDropAddress={initialDropAddress!}
                     initialUser={initialUser} 
                  />
                </div>
              )}

              {/* STEP 3 (Review & Save): Booking Confirmation */}
              {bookingFormFilled && selectedCar && bookingDetailsRaw && initialUser && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    3 Booking Confirmation (Review)
                  </h3>
                  <BookingConfirmation
                    bookingDetails={{
                      pickupDateTime: `${bookingDetailsRaw.pickupDate} ${
                        bookingDetailsRaw.pickupTime
                      }`,
                      fare: selectedCar.price,
                      pickupAddress: bookingDetailsRaw.pickupLocation,
                      dropAddress: bookingDetailsRaw.dropLocation,
                    }}
                    selectedCar={{
                      name: selectedCar.name,
                      price: selectedCar.price,
                      image: selectedCar.image,
                    }}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                      onClick={async () => {
                        // TODO: call updateBooking(existingBookingId, { … })
                        console.log(
                          `Saving edits for booking #${existingBookingId}:`,
                          bookingDetailsRaw,
                          selectedCar
                        );
                        // After saving, hide the form and show the listing again
                        setShowForm(false);
                        setBookingFormFilled(false);
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                      onClick={() => {
                        // Cancel editing
                        setShowForm(false);
                        setExistingBookingId(0);
                        setBookingFormFilled(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ─── ADD NEW BOOKING MODE ─────────────────────────────────────────────
            <>
              {/* STEP 1: Search Cabs */}
              <div className="border rounded-md p-4">
                <h2 className="text-xl font-bold mb-3"> Search Cabs</h2>
                <BookingTimeForm
                  onBookingDetailsChange={handleBookingDetailsChange}
                  allCities={allCities}
                  allTripTypes={allTripTypes}
                />
              </div>

              {/* STEP 2: Select Car */}
              {showSelectCars && bookingDetailsRaw && (
                <div className="border rounded-md p-4">
                  <h2 className="text-xl font-bold mb-3"> Select Car</h2>
                  <SelectCarsPage
                    bookingDetails={bookingDetailsRaw}
                    onCarSelect={handleCarSelect}
                    onFormComplete={handleFormComplete}
                    initialSelectedCar={null}
                    allVehicles={[]}
                    initialPickupAddress={null}
                    initialDropAddress={null}
                    initialUser={undefined}
                  />
                </div>
              )}

              {/* STEP 3: Booking Confirmation */}
              {bookingFormFilled && selectedCar && bookingDetailsRaw && (
                <div className="border rounded-md p-4">
                  <h2 className="text-xl font-bold mb-3"> Booking Confirmation</h2>
                  <BookingConfirmation
                    bookingDetails={{
                      pickupDateTime: `${bookingDetailsRaw.pickupDate} ${
                        bookingDetailsRaw.pickupTime
                      }`,
                      fare: selectedCar.price,
                      pickupAddress: bookingDetailsRaw.pickupLocation,
                      dropAddress: bookingDetailsRaw.dropLocation,
                    }}
                    selectedCar={{
                      name: selectedCar.name,
                      price: selectedCar.price,
                      image: selectedCar.image,
                    }}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                      onClick={() => {
                        // TODO: call createBooking({ … })
                        console.log(
                          'Creating new booking with details:',
                          bookingDetailsRaw,
                          selectedCar
                        );
                        // After successful creation, hide the form and show listing
                        setShowForm(false);
                        setBookingFormFilled(false);
                      }}
                    >
                      Create Booking
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                      onClick={() => {
                        // Cancel adding
                        setShowForm(false);
                        setBookingFormFilled(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ─── (G) BOOKING LIST: Only show when form is hidden ──────────────────── */}
      {!showForm && (
        <BookingList
          allCities={allCities}
          allTripTypes={allTripTypes}
          allVehicles={allVehicles}
          refreshSignal={refreshSignal}
          onEdit={(id: number) => {
            setExistingBookingId(id);
            setShowForm(true);
          }}
          onDelete={async (id: number) => {
            const ok = window.confirm(`Are you sure you want to delete booking #${id}?`);
            if (!ok) return;
            try {
              await deleteBooking(id);
              // If we just deleted the booking we were editing, reset edit state
              if (id === existingBookingId) {
                setExistingBookingId(0);
                setShowForm(false);
              }
              // Trigger a refresh of the table
              setRefreshSignal((prev) => prev + 1);
            } catch (err: any) {
              console.error(`Error deleting booking #${id}:`, err);
              alert(err.message || 'Failed to delete booking');
            }
          }}
        />
      )}
    </div>
  );
}

