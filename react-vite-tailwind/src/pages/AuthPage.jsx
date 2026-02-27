import React, { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const { navigate, params } = useRouter();

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // If in reset mode, force relevant states
  useEffect(() => {
    if (isResetPassword) {
      setIsForgotPassword(false);
      setIsLogin(true);
    }
  }, [isResetPassword]);

  // Check for reset token in URL or params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setIsResetPassword(true);
      // Clean up the URL to prevent showing the token if possible
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params && params.resetToken) {
      setResetToken(params.resetToken);
      setIsResetPassword(true);
    }
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  // old validation logic, can be enhanced with libraries like Yup or Joi in the future
  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!isLogin && !formData.name) {
  //     newErrors.name = 'Name is required';
  //   }

  //   if (!formData.email) {
  //     newErrors.email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //     newErrors.email = 'Email is invalid';
  //   }

  //   if (!formData.password) {
  //     newErrors.password = 'Password is required';
  //   } else if (formData.password.length < 6) {
  //     newErrors.password = 'Password must be at least 6 characters';
  //   }

  //   if (!isLogin && !formData.confirmPassword) {
  //     newErrors.confirmPassword = 'Please confirm your password';
  //   } else if (!isLogin && formData.password !== formData.confirmPassword) {
  //     newErrors.confirmPassword = 'Passwords do not match';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForm = () => {
    const newErrors = {};

    if (isResetPassword) {
      if (!formData.password) {
        newErrors.password = 'New password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    if (isForgotPassword) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //old submit logic, can be enhanced with better error handling and user feedback
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   setMessage({ type: '', text: '' });

  //   try {
  //     const endpoint = isLogin ? 'login' : 'register';
  //     const response = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(isLogin ? {
  //         email: formData.email,
  //         password: formData.password
  //       } : {
  //         name: formData.name,
  //         email: formData.email,
  //         password: formData.password
  //       })
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setMessage({ type: 'success', text: data.message });
  //       // Save user data to localStorage
  //       if (data.token) {
  //         localStorage.setItem('userToken', data.token);
  //         localStorage.setItem('userData', JSON.stringify({
  //           _id: data._id,
  //           name: data.name,
  //           email: data.email,
  //           role: data.role
  //         }));
  //       }

  //       // Direct redirect based on user role
  //       setTimeout(() => {
  //         if (data.role === 'admin') {
  //           navigate('admin-dashboard');
  //         } else if (data.role === 'artist') {
  //           navigate('artist-dashboard');
  //         } else {
  //           navigate('user-dashboard');
  //         }
  //       }, 1000);
  //     } else {
  //       setMessage({ type: 'error', text: data.message });
  //     }
  //   } catch (error) {
  //     setMessage({ type: 'error', text: 'Network error. Please try again.' });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let endpoint;
      if (isResetPassword) {
        endpoint = 'reset-password';
      } else if (isForgotPassword) {
        endpoint = 'forgot-password';
      } else {
        endpoint = isLogin ? 'login' : 'register';
      }

      const response = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isResetPassword ? {
          token: resetToken,
          password: formData.password
        } : (isForgotPassword ? {
          email: formData.email
        } : (isLogin ? {
          email: formData.email,
          password: formData.password
        } : {
          name: formData.name,
          email: formData.email,
          password: formData.password
        })))
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });

        if (isForgotPassword || isResetPassword) {
          // Success message for forgot/reset password
          if (isResetPassword) {
            setTimeout(() => {
              setIsResetPassword(false);
              setResetToken('');
              toggleMode('login');
              navigate('auth'); // Ensure URL is reset
            }, 3000);
          }
          return;
        }

        // Save user data to localStorage
        if (data.token) {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userData', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
          }));
        }

        // Direct redirect based on user role
        setTimeout(() => {
          if (data.role === 'admin') {
            navigate('admin-dashboard');
          } else if (data.role === 'artist') {
            navigate('artist-dashboard');
          } else {
            navigate('user-dashboard');
          }
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  //old toggle logic, can be enhanced to reset form and errors when switching modes
  // const toggleMode = (mode) => {
  //   setIsLogin(mode === 'login');
  //   setActiveTab(mode);
  //   setFormData({
  //     name: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: ''
  //   });
  //   setErrors({});
  //   setMessage({ type: '', text: '' });
  // };

  const toggleMode = (mode) => {
    setIsForgotPassword(mode === 'forgot-password');
    setIsLogin(mode === 'login' || mode === 'forgot-password');
    setActiveTab(mode === 'forgot-password' ? 'login' : mode);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-brand-200 to-brand-300 opacity-20 blur-3xl"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-orange-200 to-orange-300 opacity-20 blur-3xl"
          style={{
            right: `${-mousePosition.x * 0.03}px`,
            bottom: `${-mousePosition.y * 0.03}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-200 rounded-full opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-200 rounded-full opacity-10 animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-brand-300 rounded-full opacity-10 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl flex items-center justify-center">
          {/* Left Side - Brand Content */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-center p-12">
            <div className="mb-8">
              <div className="mb-6">
                <h1 className="text-5xl font-bold text-brand-500 mb-4">Indori Artist</h1>
                <h2 className="text-2xl text-gray-800">
                  Welcome to <span className="text-brand-500">Indori Artist</span>
                </h2>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Connect with talented artists and bring your events to life
              </p>
            </div>

            <div className="space-y-6 text-left">
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Find Amazing Artists</h3>
                  <p className="text-gray-600">Discover talented performers for your events</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Verified Professionals</h3>
                  <p className="text-gray-600">All artists are verified and reviewed</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Easy Booking</h3>
                  <p className="text-gray-600">Simple and secure booking process</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Back Button */}
              <button
                onClick={() => navigate('home')}
                className="mb-6 flex items-center text-gray-600 hover:text-brand-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>

              {/* Tab Navigation */}
              <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => toggleMode('login')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'login'
                    ? 'bg-white text-brand-500 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => toggleMode('register')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'register'
                    ? 'bg-white text-brand-500 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Title */}
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isResetPassword ? 'Reset Password' : (isForgotPassword ? 'Forgot Password' : (isLogin ? 'Welcome Back!' : 'Create Account'))}
              </h2>
              <p className="text-gray-600 mb-8">
                {isResetPassword
                  ? 'Enter your new password below'
                  : (isForgotPassword
                    ? 'Enter your email to receive a password reset link'
                    : (isLogin
                      ? 'Sign in to continue to your account'
                      : 'Join our community of talented artists'
                    )
                  )
                }
              </p>

              {/* Message Display */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {message.text}
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <AuthInput
                      label="Full Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      placeholder="Enter your full name"
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      }
                    />
                  </div>
                )}

                {!isResetPassword && (
                  <div>
                    <AuthInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="your.email@example.com"
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                  </div>
                )}

                {(!isForgotPassword || isResetPassword) && (
                  <div>
                    <AuthInput
                      label={isResetPassword ? "New Password" : "Password"}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      placeholder={isResetPassword ? "Enter new password" : "Enter your password"}
                      showPasswordToggle={true}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      }
                    />
                  </div>
                )}

                {(!isLogin || isResetPassword) && (
                  <div>
                    <AuthInput
                      label={isResetPassword ? "Confirm New Password" : "Confirm Password"}
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      placeholder={isResetPassword ? "Re-enter new password" : "Confirm your password"}
                      showPasswordToggle={true}
                      onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      }
                    />
                  </div>
                )}



                <AuthButton
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  text={isResetPassword ? 'Reset Password' : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account'))}
                />

                {isLogin && !isResetPassword && (
                  <div className="flex justify-between items-center">
                    {isForgotPassword ? (
                      <button
                        type="button"
                        onClick={() => toggleMode('login')}
                        className="text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
                      >
                        Back to Sign In
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleMode('forgot-password')}
                        className="ml-auto text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                )}

                {/* Divider */}

                {(!isResetPassword && !isForgotPassword) && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                )}



                {/* Social Login Buttons */}
                {(!isResetPassword && !isForgotPassword) && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
