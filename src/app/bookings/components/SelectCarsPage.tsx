// src/app/bookings/components/SelectCarsPage.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  checkEmail,
  createUser,
  createAddress,
  createBooking,
  fetchVehicles,
  fetchPlaceAutocomplete,
} from '../service';

interface BookingDetails {
  tripTypeId: number;
  pickupLocation: string;
  pickupCityId: number;
  dropLocation: string;
  dropCityId: number;
  pickupDate: string;
  pickupTime: string;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SelectCarsPageProps {
  bookingDetails: BookingDetails;
  onCarSelect: (car: any) => void;
  onFormComplete: () => void;

  // Prefill props:
  initialSelectedCar?: any;
  allVehicles: any[];
  initialPickupAddress?: any;
  initialDropAddress?: any;
  /** Prefill user info when editing an existing booking */
  initialUser?: UserInfo;
}

const tabContent = {
  INCLUSIONS: ['Base Fare', 'Driver Allowance', 'GST (5%)'],
  EXCLUSIONS: [
    'Pay ₹12/km after 80 km',
    'Pay ₹144/hr after 8 hours',
    'Night Allowance',
    'Toll / State tax',
    'Parking',
  ],
  FACILITIES: ['4 seater', '1 bag', 'AC'],
  'T&C': [
    'Your Trip has a KM limit as well as an Hours limit.',
    'Exceeding limits will incur extra charges.',
    'Airport entry charge (if any) is excluded.',
    'Toll, parking, and taxes are extra and paid directly.',
    'Driving between 09:45 PM to 06:00 AM requires night allowance.',
  ],
};

export default function SelectCarsPage({
  bookingDetails,
  onCarSelect,
  onFormComplete,
  initialSelectedCar,
  allVehicles,
  initialPickupAddress,
  initialDropAddress,
  initialUser,
}: SelectCarsPageProps) {
  // ─── (1) VEHICLE STATES ─────────────────────────────────────────────────────
  // If parent provided "allVehicles", use that; otherwise fetch
  const [vehicles, setVehicles] = useState<any[]>(initialSelectedCar ? allVehicles : []);
  const [activeTab, setActiveTab] = useState<keyof typeof tabContent>('INCLUSIONS');
  const [selectedCarId, setSelectedCarId] = useState<number | null>(
    initialSelectedCar ? initialSelectedCar.id : null
  );
  const [selectedCar, setSelectedCar] = useState<any>(initialSelectedCar || null);

  // We'll store fare from selectedCar.price
  const [fare, setFare] = useState<number>(initialSelectedCar ? initialSelectedCar.price : 0);

  // ─── (2) CONTACT/ADDRESS FORM STATES ─────────────────────────────────────────
  // Prefill name/email/mobile from initialUser if provided
  const [name, setName] = useState<string>(initialUser ? initialUser.name : '');
  const [email, setEmail] = useState<string>(initialUser ? initialUser.email : '');
  const [mobile, setMobile] = useState<string>(initialUser ? initialUser.phone : '');

  // Prefill pickup/drop from initial address if provided
  const [pickup, setPickup] = useState<string>(
    initialPickupAddress ? initialPickupAddress.address : ''
  );
  const [drop, setDrop] = useState<string>(
    initialDropAddress ? initialDropAddress.address : ''
  );

  // Autocomplete: pickup
  const [pickupSuggestions, setPickupSuggestions] = useState<
    { description: string; place_id: string }[]
  >([]);
  const pickupController = useRef<AbortController | null>(null);
  const pickupSession = useRef(uuidv4());

  // Autocomplete: drop
  const [dropSuggestions, setDropSuggestions] = useState<
    { description: string; place_id: string }[]
  >([]);
  const dropController = useRef<AbortController | null>(null);
  const dropSession = useRef(uuidv4());

  // ─── (3) FETCH VEHICLES ON MOUNT ─────────────────────────────────────────────
  useEffect(() => {
    // Only fetch if parent did not pass "allVehicles"
    if (!initialSelectedCar) {
      const loadVehicles = async () => {
        try {
          const data = await fetchVehicles();
          setVehicles(data);
        } catch (err) {
          console.error('Error fetching vehicles:', err);
        }
      };
      loadVehicles();
    }
  }, [initialSelectedCar]);

  // ─── (4) EMAIL BLUR: check existing user by email ────────────────────────────
  async function handleEmailBlur() {
    if (!email.trim()) return;
    try {
      const data = await checkEmail(email);
      if (data.exists && data.user) {
        setName(data.user.name || '');
        setMobile(data.user.phone || '');
      }
    } catch (err: any) {
      console.error('Error checking email:', err);
    }
  }

  // ─── (5) FETCH PICKUP AUTOCOMPLETE ──────────────────────────────────────────
  async function fetchPickupSuggestions(input: string) {
    pickupController.current?.abort();
    pickupController.current = new AbortController();
    try {
      const suggestions = await fetchPlaceAutocomplete(input, pickupSession.current);
      setPickupSuggestions(suggestions);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching pickup suggestions:', err);
      }
      setPickupSuggestions([]);
    }
  }

  function handlePickupChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPickup(val);
    if (val.trim().length >= 2) {
      fetchPickupSuggestions(val);
    } else {
      setPickupSuggestions([]);
    }
  }

  function choosePickupSuggestion(desc: string) {
    setPickup(desc);
    setPickupSuggestions([]);
  }

  // ─── (6) FETCH DROP AUTOCOMPLETE ────────────────────────────────────────────
  async function fetchDropSuggestions(input: string) {
    dropController.current?.abort();
    dropController.current = new AbortController();
    try {
      const suggestions = await fetchPlaceAutocomplete(input, dropSession.current);
      setDropSuggestions(suggestions);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching drop suggestions:', err);
      }
      setDropSuggestions([]);
    }
  }

  function handleDropChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setDrop(val);
    if (val.trim().length >= 2) {
      fetchDropSuggestions(val);
    } else {
      setDropSuggestions([]);
    }
  }

  function chooseDropSuggestion(desc: string) {
    setDrop(desc);
    setDropSuggestions([]);
  }

  // ─── (7) FORM SUBMIT: CREATE USER, ADDRESSES, BOOKING ────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedCarId || !selectedCar) {
      alert('Please select a car first.');
      return;
    }

    try {
      // (A) Decide on `user.id`:
      let user: any;

      if (initialUser) {
        // Editing: reuse existing user info
        user = {
          id: initialUser.id,
          name: name.trim(),
          phone: mobile.trim(),
          email: email.trim(),
        };
      } else {
        // Adding new: check if that email already exists
        const emailCheck = await checkEmail(email.trim());
        if (emailCheck.exists && emailCheck.user) {
          user = emailCheck.user;
        } else {
          // Create a new user
          user = await createUser({
            name: name.trim(),
            email: email.trim(),
            phone: mobile.trim(),
          });
        }
      }

      // (B) Create Pickup Address
      const pickupAddr = await createAddress({
        userId: user.id,
        type: 'PICKUP',
        address: pickup.trim(),
      });

      // (C) Create Drop Address
      const dropAddr = await createAddress({
        userId: user.id,
        type: 'DROP',
        address: drop.trim(),
      });

      // (D) Assemble booking payload & send
      const fromCityId = bookingDetails.pickupCityId;
      const toCityId = bookingDetails.dropCityId;
      const tripTypeIdNum = bookingDetails.tripTypeId;
      const computedFare = selectedCar.price;
      setFare(computedFare);

      await createBooking({
        userId: user.id,
        vehicleId: selectedCarId,
        fromCityId,
        toCityId,
        pickupAddressId: String(pickupAddr.id),
        dropAddressId: String(dropAddr.id),
        pickupDateTime: `${bookingDetails.pickupDate}T${bookingDetails.pickupTime}:00.000Z`,
        tripTypeId: tripTypeIdNum,
        fare: computedFare,
      });

      // (E) Tell parent “we’re done”
      onFormComplete();
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      alert(err.message || 'An error occurred while booking');
    }
  }

  return (
    <div className="space-y-8">
      {/* CAR SELECTION GRID */}
      {vehicles.length === 0 ? (
        <p className="text-center text-gray-500">No cars available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((c) => (
            <div
              key={c.id}
              className={`border rounded-lg p-4 hover:shadow-md cursor-pointer ${
                selectedCarId === c.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => {
                setSelectedCarId(c.id);
                setSelectedCar(c);
                onCarSelect(c);
                setFare(c.price);
              }}
            >
              <img
                src={`cars/${c.image}`}
                alt={c.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-lg">{c.name}</h3>
              <p className="text-gray-600 text-sm">{c.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold text-xl">₹ {c.price}.00/hr</span>
                <span className="text-gray-500 text-sm"> /km {c.price}.00</span>
              </div>

              {/* TABS */}
              <div className="mt-4 border-t pt-3">
                <div className="flex gap-4 flex-wrap">
                  {Object.keys(tabContent).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as keyof typeof tabContent)}
                      className={`px-2 py-1 text-sm rounded-md ${
                        activeTab === tab
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {tabContent[activeTab].map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOOKING FORM (CONTACT & ADDRESS) */}
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Fill in Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {/* EMAIL */}
          <div>
            <label className="font-semibold block mb-1">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="Enter your email here"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
          </div>

          {/* NAME */}
          <div>
            <label className="font-semibold block mb-1">FULL NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name here"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="font-semibold block mb-1">MOBILE NO.</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
          </div>

          {/* PICKUP ADDRESS */}
          <div className="relative">
            <label className="font-semibold block mb-1">PICKUP ADDRESS</label>
            <input
              type="text"
              value={pickup}
              onChange={handlePickupChange}
              placeholder="Where to pick up?"
              className="w-full border border-gray-300 p-3 rounded-md"
              autoComplete="off"
              required
            />
            {pickupSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-auto text-sm">
                {pickupSuggestions.map((s) => (
                  <li
                    key={s.place_id}
                    onClick={() => choosePickupSuggestion(s.description)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DROP ADDRESS */}
          <div className="relative">
            <label className="font-semibold block mb-1">DROP ADDRESS</label>
            <input
              type="text"
              value={drop}
              onChange={handleDropChange}
              placeholder="Where to drop?"
              className="w-full border border-gray-300 p-3 rounded-md"
              autoComplete="off"
              required
            />
            {dropSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-auto text-sm">
                {dropSuggestions.map((s) => (
                  <li
                    key={s.place_id}
                    onClick={() => chooseDropSuggestion(s.description)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md mt-4"
          >
            PROCEED
          </button>
        </form>
      </div>
    </div>
  );
}
