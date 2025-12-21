import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/mainLayout';
import { registerUser } from '../api/userApi';
import {
  Eye,
  EyeOff,
  Calendar,
  Phone,
  Mail,
  Lock,
  User,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(formData.email)) {
      return setErrorMessage('Please enter a valid email address.');
    }

    if (!validatePassword(formData.password)) {
      return setErrorMessage(
        'Password must be at least 8 characters and include at least one letter and one special character.'
      );
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return setErrorMessage('Passwords do not match.');
    }

    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        dob: formData.dob,
        phone_number: formData.phone,
        email: formData.email,
        password: formData.password,
      };

      const res = await registerUser(payload);

      if (res.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/login');
        }, 2000);

        setFormData({
          name: '',
          username: '',
          dob: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
          terms: false,
        });
      } else {
        setErrorMessage(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Server error. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errorMessage) setErrorMessage('');

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password' ? value === formData.confirmPassword : formData.password === value
      );
    }
  };

  return (
    <MainLayout>
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-success text-text1 px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 animate-bounce">
          <CheckCircle size={28} />
          <span className="font-bold text-lg">Account created successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-inactiveBg text-inactiveText px-6 py-3 rounded-full shadow-xl">
          {errorMessage}
        </div>
      )}

      {/* Register Form */}
      <div className="min-h-screen bg-lightBg dark:bg-bgDark flex items-center justify-center px-4 py-10 transition-colors duration-300">
        <div className="w-full max-w-2xl">
          <div className="bg-bg dark:bg-bgDark rounded-3xl shadow-2xl p-10 border border-activeBg dark:border-secondary transition-colors duration-300">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-text1 mb-3">Ethio Events</h1>
              <p className="text-xl text-secondary dark:text-text1">Create your account to start managing events</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Full Name */}
              <div className="relative">
                <label className="block text-primary dark:text-text1 font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-secondary dark:text-text1" size={22} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-14 pr-4 py-4 border-2 border-activeBg dark:border-secondary rounded-xl focus:border-primary focus:ring-4 focus:ring-activeBg dark:focus:ring-secondary outline-none transition bg-lightBg dark:bg-bgDark text-primary dark:text-text1"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-secondary dark:text-text1" size={22} />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full pl-14 pr-4 py-4 border-2 border-activeBg dark:border-secondary rounded-xl focus:border-primary focus:ring-4 focus:ring-activeBg dark:focus:ring-secondary outline-none transition bg-lightBg dark:bg-bgDark text-primary dark:text-text1"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-secondary dark:text-text1" size={22} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-14 pr-4 py-4 border-2 border-activeBg dark:border-secondary rounded-xl focus:border-primary focus:ring-4 focus:ring-activeBg dark:focus:ring-secondary outline-none transition bg-lightBg dark:bg-bgDark text-primary dark:text-text1"
                    placeholder="+251 912 345 678"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-secondary dark:text-text1" size={22} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleChange}
                    required
                    className="w-full pl-14 pr-4 py-4 border-2 border-activeBg dark:border-secondary rounded-xl focus:border-primary focus:ring-4 focus:ring-activeBg dark:focus:ring-secondary outline-none transition bg-lightBg dark:bg-bgDark text-primary dark:text-text1"
                    placeholder="Choose a unique username"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-secondary dark:text-text1" size={22} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-14 pr-4 py-4 border-2 border-activeBg dark:border-secondary rounded-xl focus:border-primary focus:ring-4 focus:ring-activeBg dark:focus:ring-secondary outline-none transition bg-lightBg dark:bg-bgDark text-primary dark:text-text1"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-secondary dark:text-text1" size={22} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-14 pr-14 py-4 border-2 border-activeBg dark:border-secondary rounded-xl focus:border-primary focus:ring-4 focus:ring-activeBg dark:focus:ring-secondary outline-none transition bg-lightBg dark:bg-bgDark text-primary dark:text-text1"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-secondary dark:text-text1 hover:text-buttonHover"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-primary dark:text-text1 font-semibold mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-secondary dark:text-text1" size={22} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full pl-14 pr-14 py-4 border-2 rounded-xl outline-none transition bg-lightBg dark:bg-bgDark text-primary dark:text-text1 ${
                      !passwordMatch && formData.confirmPassword
                        ? 'border-inactiveText'
                        : 'border-activeBg dark:border-secondary focus:border-primary focus:ring-4 focus:ring-activeBg dark:focus:ring-secondary'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-secondary dark:text-text1 hover:text-buttonHover"
                  >
                    {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {!passwordMatch && formData.confirmPassword && (
                  <p className="text-inactiveText text-sm mt-2">Passwords do not match!</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary dark:focus:ring-secondary"
                />
                <label className="text-secondary dark:text-text1">
                  I agree to the{' '}
                  <a className="text-primary dark:text-secondary font-bold hover:underline">Terms & Conditions</a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formData.terms || !passwordMatch}
                className="w-full bg-primary dark:bg-secondary text-text1 py-5 rounded-xl font-bold text-xl hover:bg-buttonHover dark:hover:bg-primary transition transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                <span>Create Account</span>
                <CheckCircle size={28} />
              </button>
              <div className="mt-8 text-center">
                    <p className="text-primary dark:text-text1">
                      Are you already an account?{" "}
                      <Link
                        to="/login"
                        className="text-secondary dark:text-secondary font-bold hover:text-buttonHover dark:hover:text-primary"
                      >
                        Login here
                      </Link>
                    </p>
                  </div>
            </form>
          </div>
        </div>
      </div>
      
    </MainLayout>
  );
}
