'use client';

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function TableActions({ onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onEdit}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
      >
        Delete
      </button>
    </div>
  );
}
