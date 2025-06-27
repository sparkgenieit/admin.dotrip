// src/app/drivers/DriversMainContent.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  fetchDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  fetchVehicles
} from './service';
import { Driver, Vehicle } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';
import { useUser } from '@/hooks/useUser';

export default function DriversMainContent() {
  const { id: userId, role } = useUser();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState<Omit<Driver, 'id'>>({
    name: '',
    license: '',
    phone: '',                 
    userId: userId || 0,
    email: '',
    password: '',
    vendorId: userId || 0,
    vehicleId: undefined,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
    const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showReassign, setShowReassign] = useState(false);

 const loadVehicles = async () => {
  const filters: { vendorId?: number; driverId?: number } = {};
  if (role === 'VENDOR') filters.vendorId = userId;
  if (role === 'DRIVER') filters.driverId = userId;
  try {
    const vehicles = await fetchVehicles(filters);
    setVehicles(vehicles);
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
  }
};

useEffect(() => {
  if (!userId || !role) return;

  fetchDrivers().then(setDrivers);

  const filters: { vendorId?: number; driverId?: number } = {};
  if (role === 'VENDOR') filters.vendorId = userId;
  if (role === 'DRIVER') filters.driverId = userId;

  fetchVehicles(filters)
    .then(setVehicles)
    .catch(console.error);
}, [userId, role]);



  const openAddForm = () => {
    setFormData({ name: '', license: '', userId: userId || 0,
    email: '',
    password: '', vendorId: userId || 0, vehicleId: undefined });
    setEditingId(null);
    setEditingVehicleId(null);
    setShowForm(true);
  };

const startEdit = (d: Driver) => { console.log('KKKK',d.user);
  setEditingVehicleId(Number(d.user.vehiclesAsDriver[0]?.id));
  setFormData({
    name: d.name,
    license: d.license,
    userId: d.userId,
    vendorId: Number(d.vendorId),
    vehicleId: Number(d.user.vehiclesAsDriver[0]?.id),
    email: d.user.email || '', // show only in div
    phone: d.user?.phone || '',
    password: '',         // not used in edit
  });
  setEditingId(d.id!);
  setShowForm(true);
};

  const handleDeleteConfirmed = async (id: number) => {
  await deleteDriver(id);
  const [updatedDrivers, updatedVehicles] = await Promise.all([
    fetchDrivers(),
    fetchVehicles({ vendorId: userId }),
  ]);
  setDrivers(updatedDrivers);
  setVehicles(updatedVehicles);
  setConfirmDeleteId(null);
};

  const generatePassword = () => {
    const symbols = '!@#$%^&*()-_';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const all = upper + lower + digits + symbols;

    const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

    let password = getRandom(upper) + getRandom(lower) + getRandom(digits) + getRandom(symbols);
    for (let i = 0; i < 8; i++) password += getRandom(all);
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    setFormData(prev => ({ ...prev, password }));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.vehicleId = Number(formData.vehicleId);
    if (editingId != null) {
      await updateDriver(editingId, formData);
    } else {
      await addDriver(formData);
    }

      const updatedDrivers = await fetchDrivers();
  setDrivers(updatedDrivers);
  await loadVehicles(); // refresh vehicles only after update
   
    setShowForm(false);
    setEditingId(null);
    setEditingVehicleId(null);
    setShowReassign(false);
    setFormData({ name: '', license: '', userId: userId || 0,
    email: '',
    password: '', vendorId: userId || 0, vehicleId: undefined });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
       [name]:  type === 'number' ? Number(value) : value,
    }));
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };
console.log('formData',formData)
console.log(editingId != null && editingVehicleId && !showReassign);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Drivers</h1>
      <button
        onClick={openAddForm}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Driver
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              name="name"
              type="text"
              className="border p-2 w-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1">License #</label>
            <input
              name="license"
              type="text"
              className="border p-2 w-full"
              value={formData.license}
              onChange={handleChange}
              required
            />
            </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
             name="phone"
             type="text"
             className="border p-2 w-full"
             value={formData.phone || ''}
             onChange={handleChange}
             required 
             />
          </div>
            {editingId == null ? (
  <>
    <div>
      <label className="block mb-1">Email</label>
      <input
        name="email"
        type="email"
        className="border p-2 w-full"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>
    <div>
      <label className="block mb-1">Password</label>
      <div className="flex gap-2">
        <input
          name="password"
          type="text"
          className="border p-2 w-full"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={generatePassword}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Generate
        </button>
      </div>
    </div>
  </>
) : (
  <div>
    <label className="block mb-1">Email</label>
    <div className="p-2 border rounded bg-gray-50">{formData.email}</div>
  </div>
)}

         
          <div>
            <label className="block mb-1">Assigned Vehicle</label>
            
             {editingId != null && editingVehicleId && !showReassign ? (
              <div className="flex items-center gap-4">
                <div className="p-2 border rounded bg-gray-50">
                 {vehicles.find(v => v.id === editingVehicleId)?.name} {vehicles.find(v => v.id === editingVehicleId)?.model || '—'}

                </div>
                <button
                  type="button"
                  onClick={() => setShowReassign(true)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Reassign
                </button>
              </div>
            ) : (
          
          <select
            name="vehicleId"
            className="border p-2 w-full"
            value={formData.vehicleId ?? ''}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {vehicles
             .filter(v => v.driverId == null || v.driverId === 0) // 👈 only unassigned vehicles
              .map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.model}
                </option>
              ))}
          </select>
        )}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingId != null ? 'Update Driver' : 'Add Driver'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">License</th>
             <th className="px-4 py-2 text-left">Phone Number</th>
            <th className="px-4 py-2 text-left">Vehicle</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(d => (
            <tr key={d.id} className="border-t">
              <td className="px-4 py-2">{d.name}</td>
              <td className="px-4 py-2">{d.license}</td>
              <td className="px-4 py-2">{d.user?.phone || '—'}</td>
            <td className="px-4 py-2">
              {d.user.vehiclesAsDriver?.[0]
                ? `${d.user.vehiclesAsDriver[0].name} ${d.user.vehiclesAsDriver[0].model}`
                : '—'}
            </td>
              <td className="px-4 py-2">
                <TableActions
                  onEdit={() => startEdit(d)}
                  onDelete={() => handleDelete(d.id!)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModal<Driver>
        itemId={confirmDeleteId}
        deleteFn={handleDeleteConfirmed}        
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this driver?"
      />
    </div>
  );
}
