import { FiMail, FiBell, FiMenu } from "react-icons/fi";
import ProfileBox from "./profileBox";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/adminApi.jsx";

export default function Navbar({ isMobileOpen, setMobileOpen }) {
  const { user, jwt } = useAuth();     
  const { notifications } = useNotification();
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const role = user?.role;

  // Fetch contact messages
  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      try {
        const res = await API.get("/contact/messages", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [user, jwt]);

  // Count unread notifications
  const userNotifications = notifications.filter((n) => n.role === role);
  const unreadNotifCount = userNotifications.filter((n) => !n.read).length;

  // Count unread emails/messages
  const userMessages = messages.filter((m) => m.role === role);
  const unreadMailCount = userMessages.filter((m) => m.status !== "answered" && m.status !== "read").length;

  const dashboardTitle =
    role === "superadmin"
      ? "Super Admin Dashboard"
      : role === "admin"
      ? "Admin Dashboard"
      : "Participant Dashboard";

  const handleNotificationClick = () => {
    if (!user) navigate("/login");
    else if (role === "superadmin") navigate("/superadmin/notifications");
    else if (role === "admin") navigate("/admin/notifications");
    else navigate("/participant/notifications");
  };

  const handleMailClick = () => {
    if (!user) navigate("/login");
    else if (role === "superadmin") navigate("/superadmin/contact");
    else if (role === "admin") navigate("/admin/contact");
    else navigate("/participant/contact");
  };

  return (
    <nav className="w-full h-16 bg-primary text-white flex items-center justify-between px-6 shadow-md relative">
      <button
        onClick={() => setMobileOpen(!isMobileOpen)}
        className="md:hidden text-white hover:text-secondary transition"
      >
        <FiMenu size={26} />
      </button>

      <h1 className="text-xl font-semibold tracking-wide hidden md:block">
        {dashboardTitle}
      </h1>

      <div className="flex items-center gap-6 relative">
        <div className="relative cursor-pointer" onClick={handleMailClick}>
          <FiMail size={20} className="hover:text-secondary" />
          {unreadMailCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadMailCount}
            </span>
          )}
        </div>

        {/* Notification icon */}
        <div className="relative cursor-pointer" onClick={handleNotificationClick}>
          <FiBell size={20} className="hover:text-secondary" />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadNotifCount}
            </span>
          )}
        </div>

        <ProfileBox size="md" role={role} />
      </div>
    </nav>
  );
}
