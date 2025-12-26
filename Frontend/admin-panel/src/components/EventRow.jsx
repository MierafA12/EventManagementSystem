import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function EventRow({ event, onEdit, onDelete }) {
  return (
    <tr className="border-b hover:bg-lightBg dark:hover:bg-primary">
      <td className="px-4 py-3">{event.title}</td>
      <td className="px-4 py-3">{event.category}</td>
      <td className="px-4 py-3">{event.location}</td>
      <td className="px-4 py-3">{event.date}</td>
      <td className="px-4 py-3">{event.time}</td>
      <td className="px-4 py-3">{event.fee}</td>
      <td className="px-4 py-3">{event.capacity}</td>

      <td className="px-4 py-3 flex gap-3 items-center">
        {/* Edit */}
        <button
          onClick={() => onEdit(event)}
          className="p-2 text-primary hover:bg-lightBg rounded-lg transition dark:text-secondary"
        >
          <FiEdit size={18} />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(event)}
          className="p-2 text-error hover:bg-inactiveBg rounded-lg transition"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
