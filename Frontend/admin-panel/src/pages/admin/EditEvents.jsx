import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Button1 } from "../../components/Button";

export default function EditEventModal({ event, onClose, onSave }) {
  if (!event) return null;

  const [form, setForm] = useState({
    id: "",
    title: "",
    category: "",
    location: "",
    date: "",
    time: "",
    fee: "",
    capacity: "",
  });

  const [saved, setSaved] = useState(false);

  // Populate form when event changes
  useEffect(() => {
    if (event) {
      setForm({ ...event });
      setSaved(false);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Basic validation
    const requiredFields = ["title", "category", "location", "date", "time"];
    for (let field of requiredFields) {
      if (!form[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }

    onSave(form);
    setSaved(true);

    // Close modal after 1 second
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div
      className="fixed inset-0 bg-primary0 flex items-center justify-center z-50 px-4"
      onClick={onClose} // clicking outside closes modal
    >
      <div
        className="bg-text1 w-full max-w-lg rounded-xl shadow-lg relative flex flex-col max-h-[90vh] dark:text-text1 dark:bg-bgDark"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-primary dark:text-text1">
            Edit Event
          </h2>
          <button
            onClick={onClose}
            className="text-primary dark:text-text1 hover:text-secondary"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {["title", "category", "location", "date", "time", "fee", "capacity"].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium dark:text-text1 capitalize">
                {field}
              </label>
              <input
                type={
                  field === "date"
                    ? "date"
                    : field === "time"
                    ? "time"
                    : field === "capacity"
                    ? "number"
                    : "text"
                }
                name={field}
                className="w-full border px-3 py-2 rounded mt-1 dark:text-text1 dark:bg-bgDark"
                value={form[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          {saved && (
            <p className="text-green-500 text-sm mt-2">Changes saved!</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <Button1 onClick={handleSave}>Save Changes</Button1>
        </div>
      </div>
    </div>
  );
}
