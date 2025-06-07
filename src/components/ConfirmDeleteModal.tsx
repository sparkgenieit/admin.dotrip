import React from 'react';

interface ConfirmDeleteModalProps<T> {
  /** The ID of the item to delete */
  itemId: number | null;
  /** Function to delete item on server */
  deleteFn: (id: number) => Promise<void>;
  /** State setter for remaining items */
  setItems?: React.Dispatch<React.SetStateAction<T[]>>; // ✅ optional now
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onCancel: () => void;
  /** Title for the modal */
  title?: string;
  /** Message in the modal */
  message?: string;
}

export default function ConfirmDeleteModal<T extends { id?: number }>({
  itemId,
  deleteFn,
  setItems,
  isOpen,
  onCancel,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item?',
}: ConfirmDeleteModalProps<T>) {
  if (!isOpen || itemId === null) return null;

  const handleConfirm = async () => {
    await deleteFn(itemId);
    if (setItems) {
      setItems(prev => prev.filter(item => item.id !== itemId));
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
