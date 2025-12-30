// src/pages/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../admin-panel/src/context/AuthContext.jsx";
import ProfileBox from "../component/profileBox.jsx";
import ChangePasswordModal from "../../../admin-panel/src/components/ChangePassword.jsx"; 
import { changePassword } from "../api/userApi.jsx"; 

export default function Profile() {
  const { user, logout, jwt } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!user) {
    return <p className="text-center mt-32 text-primary dark:text-text1">Loading...</p>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goBack = () => navigate(-1);
  const goEdit = () => navigate("/editProfile");

  return (
    <div className="min-h-screen bg-lightBg dark:bg-bgDark px-4 py-6 transition-colors duration-300">
      <div className="bg-bg dark:bg-bgDark rounded-3xl shadow-2xl dark:shadow-lg w-full max-w-md mx-auto p-6 relative transition-colors duration-300">
        
        {/* Back Button */}
        <button
          onClick={goBack}
          className="text-primary dark:text-text1 font-semibold mb-4 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Profile Avatar */}
        <div className="relative w-fit mx-auto -mt-16">
          <ProfileBox size="lg" onClick={goEdit} />
          <button
            onClick={goEdit}
            className="absolute bottom-0 right-0 bg-primary dark:bg-secondary text-white p-1 rounded-full shadow-lg hover:bg-secondary dark:hover:bg-primary transition"
            title="Edit Profile"
          >
            ✎
          </button>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-center text-primary dark:text-text1 mt-4">
          {user.full_name || user.username}
        </h2>

        <div className="mt-6 space-y-3">
          {[
            ["Full Name", user.full_name],
            ["Email", user.email],
            ["Username", user.username],
            ["Date of Birth", user.dob],
            ["Phone", user.phone_number],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center p-3 bg-lightBg dark:bg-bgDark rounded-xl shadow-sm dark:shadow-md transition-colors duration-300"
            >
              <span className="font-semibold text-primary dark:text-text1">{label}</span>
              <span className="text-secondary dark:text-text1">{value || "Not set"}</span>
            </div>
          ))}
        </div>

        {/* Change Password Button */}
        <div>
          <button
            className="mt-6 w-full bg-red-500 dark:bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-600 dark:hover:bg-red-700 transition flex items-center justify-center gap-2"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 dark:bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-600 dark:hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          Log Out
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          jwt={jwt}
          changePasswordApi={changePassword}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => alert("Password changed successfully!")}
        />
      )}
    </div>
  );
}
