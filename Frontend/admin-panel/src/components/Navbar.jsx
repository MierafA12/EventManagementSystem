import { FiMail, FiBell, FiMenu } from "react-icons/fi";
import ProfileBox from "./profileBox";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ isMobileOpen, setMobileOpen }) {
  const { user } = useAuth();     // <-- get user from context
  const role = user?.role;        // admin / superadmin

  const dashboardTitle =
    role === "superadmin"
      ? "Super Admin Dashboard"
      : "Admin Dashboard";

  return (
    <nav className="w-full h-16 bg-primary text-white flex items-center justify-between px-6 shadow-md">

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!isMobileOpen)}
        className="md:hidden text-white hover:text-secondary transition"
      >
        <FiMenu size={26} />
      </button>

      {/* Dynamic role title */}
      <h1 className="text-xl font-semibold tracking-wide hidden md:block">
        {dashboardTitle}
      </h1>

      <div className="flex items-center gap-6">
        <FiMail size={20} className="hover:text-secondary cursor-pointer" />
        <FiBell size={20} className="hover:text-secondary cursor-pointer" />
        <ProfileBox size="md" role={role} />
      </div>
    </nav>
  );
}
