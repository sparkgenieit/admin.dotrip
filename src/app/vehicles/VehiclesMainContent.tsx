'use client';

import { useEffect, useState } from 'react';
import {
  fetchVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  checkRegistrationNumber,

} from './service';
import { Vehicle } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';
import { useUser } from '@/hooks/useUser';
import { API_BASE_URL } from '@/lib/constants';

const VEHICLES_URL = `${API_BASE_URL}/admin/vehicles`;
export default function VehiclesMainContent() {
  const { id: userId, role } = useUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    name: '',
    model: '',
    image: '',
    capacity: 0,
    price: 0,
    originalPrice: 0,
    registrationNumber: '',
    vendorId: userId || 0,
    driverId: null,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !role) return;
    const load = async () => {
      const data = await fetchVehicles(role === 'VENDOR' ? { vendorId: userId } : {});
      setVehicles(data);
    };
    load();
  }, [userId, role]);

  const openAddForm = () => {
    setFormData({
      name: '',
      model: '',
      image: '',
      capacity: 0,
      price: 0,
      originalPrice: 0,
      registrationNumber: '',
      vendorId: userId || 0,
      driverId: null,
    });
    setEditingId(null);
    setShowForm(true);
    setRegError(null);
  };

  const startEdit = (v: Vehicle) => {
    setFormData({
      name: v.name,
      model: v.model,
      image: v.image,
      capacity: v.capacity,
      price: v.price,
      originalPrice: v.originalPrice,
      registrationNumber: v.registrationNumber,
      vendorId: v.vendorId || userId,
      driverId: v.driverId || null,
    });
    setEditingId(v.id!);
    setShowForm(true);
    setRegError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regError) return;
      const hasError = await checkRegistrationExists();
       if (hasError) return;
    if (editingId != null) {
      await updateVehicle(editingId, formData);
    } else {
      await addVehicle(formData);
    }
    const refreshed = await fetchVehicles(role === 'VENDOR' ? { vendorId: userId } : {});
    setVehicles(refreshed);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirmed = async (id: number) => {
    await deleteVehicle(id);
    const refreshed = await fetchVehicles(role === 'VENDOR' ? { vendorId: userId } : {});
    setVehicles(refreshed);
    setConfirmDeleteId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };


  const checkRegistrationExists = async () => {
    if (!formData.registrationNumber) return;
    
  const params = new URLSearchParams({ registrationNumber: formData.registrationNumber });
  if (editingId !== null) {
    params.append('excludeId', String(editingId));
  }
    try {
      const data:any = await checkRegistrationNumber(params);
      if (data.exists) {
        setRegError('This registration number is already in use.');
        return true;
      } else {
        setRegError(null);
        return false;
      }
    } catch (err) {
      setRegError('Error checking registration.');
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Vehicles</h1>
      <button onClick={openAddForm} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Add Vehicle
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {['name', 'model', 'image', 'capacity', 'price', 'originalPrice'].map(field => (
            <div key={field}>
              <label className="block mb-1">{field}</label>
              <input
                name={field}
                type={field === 'capacity' || field === 'price' || field === 'originalPrice' ? 'number' : 'text'}
                className="border p-2 w-full"
                value={(formData as any)[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div>
            <label className="block mb-1">Registration Number</label>
            <input
              name="registrationNumber"
              type="text"
              className="border p-2 w-full"
              value={formData.registrationNumber}
              onChange={handleChange}
              onBlur={checkRegistrationExists}
              required
            />
            {regError && <div className="text-red-600 text-sm mt-1">{regError}</div>}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!!regError}>
              {editingId ? 'Update' : 'Add'}
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

      <table className="min-w-full bg-white border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Model</th>
            <th className="px-4 py-2 text-left">Capacity</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Registration #</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id} className="border-t">
              <td className="px-4 py-2">{v.name}</td>
              <td className="px-4 py-2">{v.model}</td>
              <td className="px-4 py-2">{v.capacity}</td>
              <td className="px-4 py-2">{v.price}</td>
              <td className="px-4 py-2">{v.registrationNumber}</td>
              <td className="px-4 py-2">
                <TableActions onEdit={() => startEdit(v)} onDelete={() => handleDelete(v.id!)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModal<Vehicle>
        itemId={confirmDeleteId}
        deleteFn={handleDeleteConfirmed}
        setItems={setVehicles}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle?"
      />
    </div>
  );
}
