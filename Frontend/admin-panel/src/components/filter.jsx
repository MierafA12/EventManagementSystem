import { useState, useRef, useEffect } from "react";

export default function Filter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const options = [
    { label: "All Admins", value: "all" },
    { label: "Active Admins", value: "active" },
    { label: "Inactive Admins", value: "inactive" },
  ];

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Filter Admins";

  return (
    <div className="relative" ref={ref}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-52 px-4 py-2 bg-text1 dark:bg-bgDark border border-gray-300 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50 dark:text-text1"
      >
        {selectedLabel}
        <span className="ml-2">▼</span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-10 mt-2 w-52 bg-text1 dark:bg-bgDark border border-gray-200 rounded-lg shadow dark:text-text1">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-primary cursor-pointer"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
