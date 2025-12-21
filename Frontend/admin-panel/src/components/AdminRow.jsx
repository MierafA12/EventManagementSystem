import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function AdminRow({ admin, onToggleStatus, onDelete, onEdit }) {
  return (
    <tr className="border-b hover:bg-lightBg dark:hover:bg-activeBg">
      <td className="px-4 py-3">{admin.full_name}</td>
      <td className="px-4 py-3">{admin.username}</td>

      <td className="px-4 py-3">
        <span
          className={`px-3 py-1 text-sm rounded-lg ${
            admin.status === "active"
              ? "bg-activeBg text-activeText"
              : "bg-inactiveBg text-inactiveText"
          }`}
        >
          {admin.status}
        </span>
      </td>

      <td className="px-4 py-3 flex gap-3 items-center">
        {/* Activate / Deactivate */}
        <button
          className="px-3 py-1 bg-secondary text-primary rounded-lg hover:bg-buttonHover transition"
          onClick={onToggleStatus}
        >
          {admin.status === "active" ? "Deactivate" : "Activate"}
        </button>

        {/* Edit */}
        <button
          onClick={onEdit}
          className="p-2 text-primary hover:bg-lightBg rounded-lg transition dark:text-secondary"
        >
          <FiEdit size={18} />
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="p-2 text-error hover:bg-inactiveBg rounded-lg transition"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
