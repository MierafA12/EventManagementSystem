export default function AdminDelete({ admin, onClose, onConfirm }) {
  if (!admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Delete Admin
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete
          <span className="font-semibold text-primary"> {admin.fullName} </span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-error text-white hover:bg-red-600"
            onClick={() => onConfirm(admin.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
