import { FiChevronDown } from "react-icons/fi";

export default function ProfileBox({ size = "md" }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <img
        src="/profile.jpg"
        alt="profile"
        className={`rounded-full border-2 border-secondary 
          ${size === "lg" ? "h-20 w-20" : "h-10 w-10"}`}
      />

      {/* For sidebar large version */}
      {size === "lg" && (
        <div className="text-center">
          <h2 className="text-lg font-semibold">Admin User</h2>
          <p className="text-gray-500 text-sm">Administrator</p>
        </div>
      )}

      {/* For navbar small version */}
      {size === "md" && (
        <div className="hidden md:flex items-center gap-1">
          <span className="font-medium">Admin</span>
          <FiChevronDown />
        </div>
      )}
    </div>
  );
}
