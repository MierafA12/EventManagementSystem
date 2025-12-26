import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import DarkModeToggle from "../components/DarkMode";

export default function SettingsPage() {

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow bg-white dark:bg-[#1f1f1f]">
        
        <h1 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
          Settings
        </h1>

        {/* ---------------- DARK MODE ---------------- */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-lg border dark:border-gray-700">
          <div>
            <h2 className="text-lg font-medium text-primary dark:text-text1">
              Dark Mode
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Toggle light and dark theme.
            </p>
          </div>
          <DarkModeToggle />
        </div>

      </div>
    </AdminLayout>
  );
}
