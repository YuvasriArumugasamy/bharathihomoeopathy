import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

export const Login = ({ initialTab = 'login' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, googleLogin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form States
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/my-account';

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        showToast('Welcome! You have successfully logged in with Google', 'success');
        navigate(redirectUrl);
      } else {
        showToast(res.message || 'Google login failed', 'error');
      }
    } catch (error) {
      showToast('Google login failed. Please try again.', 'error');
    }
  };

  // Handle Google Login Error
  const handleGoogleError = () => {
    showToast('Google login failed. Please try again.', 'error');
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      showToast('Please enter your email and password', 'warning');
      return;
    }
    setLoginLoading(true);
    const res = await login(loginEmail.trim(), loginPassword);
    setLoginLoading(false);

    if (res.success) {
      showToast('Welcome back to Dr. Bharathi Homeo Care!', 'success');
      navigate(redirectUrl);
    } else {
      showToast(res.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerData.firstName.trim() || !registerData.email.trim() || !registerData.password) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }
    if (registerData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!registerData.agreeTerms) {
      showToast('Please accept the terms and conditions to proceed', 'warning');
      return;
    }

    setRegisterLoading(true);
    const res = await register({
      firstName: registerData.firstName.trim(),
      lastName: registerData.lastName.trim(),
      email: registerData.email.trim(),
      phone: registerData.phone || '',
      password: registerData.password,
    });
    setRegisterLoading(false);

    if (res.success) {
      showToast('Account created successfully! Welcome to Dr. Bharathi Homeo Care', 'success');
      navigate(redirectUrl);
    } else {
      showToast(res.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white rounded-2xl p-8 sm:p-12 max-w-xl w-full shadow-lg">
        
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <Link to="/" className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'login' ? 'Log in to your account' : 'Create your account'}
          </h2>
          <p className="text-gray-600">
            {activeTab === 'login' ? 'Welcome back! Enter your details below' : 'Join thousands of patients healing naturally'}
          </p>
        </div>

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            
            {/* Google Login Button */}
            <div className="space-y-3">
              <GoogleLoginButton 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-gray-900 font-semibold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email / Phone Number
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter Your Email or Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter Your Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Password reset link will be sent to your registered email address.', 'info')}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Forget Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-200"
            >
              {loginLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            
            {/* Google Login Button */}
            <div className="space-y-3">
              <GoogleLoginButton 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              
              <div className="text-center text-sm text-gray-600">
                Already registered?{' '}
                <button 
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-gray-900 font-semibold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email / Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="Enter Your Email or Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Enter Your Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={registerData.agreeTerms}
                  onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>I agree to Dr. Bharathi Terms and Privacy Policy</span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              {registerLoading ? 'Creating Account...' : 'SIGN UP'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
