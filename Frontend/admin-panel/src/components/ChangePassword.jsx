src/components/ChangePasswordModal.jsx
import { useState } from "react";

export default function ChangePasswordModal({ jwt, onClose, onSuccess, changePasswordApi }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }
    try {
      const res = await changePasswordApi({ currentPassword, newPassword }, jwt);
      if (res.data.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-bgDark p-6 rounded-lg w-96 shadow-lg transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-primary dark:text-text1">Change Password</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 mb-2 rounded border dark:bg-bgDark dark:text-white"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-2 rounded border dark:bg-bgDark dark:text-white"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded border dark:bg-bgDark dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}