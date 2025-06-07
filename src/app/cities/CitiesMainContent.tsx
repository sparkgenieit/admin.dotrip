// src/app/cities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchCities, addCity, updateCity, deleteCity } from './service';
import { City } from './types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TableActions from '@/components/TableActions';

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState<Omit<City, 'id'>>({
    name: '',
    logo_url: '',
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cities
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCities();
        setCities(data);
      } catch (err) {
        console.error(err);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Open add form
  const handleAdd = () => {
    setFormData({ name: '', logo_url: '', status: true });
    setEditingId(null);
    setShowModal(true);
  };

  // Open edit form
  const handleEdit = (city: City) => {
    setEditingId(city.id!);
    setFormData({ name: city.name, logo_url: city.logo_url, status: city.status });
    setShowModal(true);
  };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = await updateCity(editingId, formData);
      setCities(prev => prev.map(b => (b.id === editingId ? updated : b)));
    } else {
      const added = await addCity(formData);
      setCities(prev => [...prev, added]);
    }
    setShowModal(false);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  // Trigger delete confirmation
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Cities</h1>
      <button
        onClick={handleAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add City
      </button>

      {loading ? (
        <p className="text-gray-600">Loading cities...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Logo</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city.id} className="border-t">
                <td className="px-4 py-2">{city.name}</td>
                <td className="px-4 py-2">
                  <img src={city.logo_url} alt={city.name} className="h-8 w-auto" />
                </td>
                <td className="px-4 py-2">{city.status ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2">
  <TableActions
    onEdit={() => handleEdit(city)}
    onDelete={() => handleDelete(city.id!)}
  />
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId !== null ? 'Edit' : 'Add'} City
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="City Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <input
                name="logo_url"
                type="text"
                placeholder="Logo URL"
                value={formData.logo_url}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <label className="flex items-center gap-2">
                <input
                  name="status"
                  type="checkbox"
                  checked={formData.status}
                  onChange={handleChange}
                />
                Active
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingId !== null ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal<City>
        itemId={confirmDeleteId}
        deleteFn={deleteCity}
        setItems={setCities}
        isOpen={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this city?"
      />
    </div>
  );
}
