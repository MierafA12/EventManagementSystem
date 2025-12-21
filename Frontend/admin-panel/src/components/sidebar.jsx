import { NavLink } from "react-router-dom";
import * as Icons from "react-icons/fi";
import ProfileBox from "./profileBox";
import { useAuth } from "../context/AuthContext";
import { adminMenu, superAdminMenu } from "../data/sidebarMenu";

export default function Sidebar({ collapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();

  // pick menu based on role
  const menu = user?.role === "superadmin" ? superAdminMenu : adminMenu;

  return (
    <aside
      className={`
        bg-bg text-primary shadow-lg border-r border-gray-200 
        dark:bg-bgDark dark:text-text1Dark
        h-screen fixed md:relative z-40
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "w-20 px-3" : "w-64 px-4"}
      `}
    >
      {/* Profile section */}
      <div className="w-full mt-6 flex justify-center">
        {collapsed ? <ProfileBox size="sm" /> : <ProfileBox size="lg" />}
      </div>

      {/* Menu */}
      <div className="flex-1 mt-10">
        <ul className="space-y-3">
          {menu.map((item, index) => {
            const Icon = Icons[item.icon];
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition
                      ${
                        isActive
                          ? "bg-secondary text-primary font-semibold dark:bg-secondaryDark dark:text-primaryDark"
                          : "hover:bg-buttonHover hover:text-secondary dark:hover:bg-secondaryDark dark:hover:text-primaryDark"
                      }`
                  }
                >
                  <Icon className="text-xl" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 w-[85%]">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-error px-4 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-700 w-full transition"
        >
          <Icons.FiLogOut size={20} />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
