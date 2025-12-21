import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import MainLayout from "../layout/mainLayout";
import { useAuth } from "../../../admin-panel/src/context/AuthContext.jsx";
import { useLocation } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/events";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const result = await login(email, password);

    if (!result.success) {
      setMessage(result.message);
      setIsError(true);
      return;
    }

    if (result.user.role !== "participant") {
      setMessage("Only participants can login here.");
      setIsError(true);
      return;
    }

    // ✅ success → redirect
    navigate(redirectPath);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-lightBg dark:bg-bgDark flex items-center justify-center px-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <div className="bg-bg dark:bg-bgDark rounded-3xl shadow-2xl p-10 border border-secondary dark:border-secondary transition-colors duration-300">

            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-primary dark:text-text1 mb-3">
                Ethio Events
              </h1>
              <p className="text-primary dark:text-text1 text-lg">
                Welcome back! Please login to continue.
              </p>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg text-center font-medium ${
                  isError
                    ? "bg-inactiveBg text-inactiveText border border-inactiveText dark:bg-inactiveBg dark:text-inactiveText dark:border-inactiveText"
                    : "bg-activeBg text-activeText border border-activeText dark:bg-activeBg dark:text-activeText dark:border-activeText"
                } transition-colors duration-300`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-primary dark:border-text1 rounded-xl bg-bg dark:bg-bgDark text-primary dark:text-text1 transition-colors duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 border border-primary dark:border-text1 rounded-xl bg-bg dark:bg-bgDark text-primary dark:text-text1 transition-colors duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary dark:text-text1"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer text-primary dark:text-text1">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-5 h-5 text-primary dark:text-text1 rounded"
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="#"
                  className="text-primary dark:text-text1 hover:text-buttonHover dark:hover:text-secondary font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-primary dark:bg-secondary text-text1 py-4 rounded-xl font-bold text-lg hover:bg-buttonHover dark:hover:bg-primary transition-colors duration-300"
              >
                Login
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-primary dark:text-text1">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-secondary dark:text-secondary font-bold hover:text-buttonHover dark:hover:text-primary"
                >
                  Register here
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
