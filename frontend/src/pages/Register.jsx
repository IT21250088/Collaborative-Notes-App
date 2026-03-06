import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Password strength criteria
  const passwordCriteria = [
    { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    { label: "Contains uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
    { label: "Contains lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
    { label: "Contains number", test: (pwd) => /[0-9]/.test(pwd) },
    { label: "Contains special character", test: (pwd) => /[!@#$%^&*]/.test(pwd) }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else {
      const failedCriteria = passwordCriteria.filter(c => !c.test(password))
      if (failedCriteria.length > 0) {
        newErrors.password = "Password does not meet all requirements"
      }
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  const submit = async () => {
    if (!validateForm()) return

    try {
      setIsLoading(true)
      await API.post("/auth/register", { name, email, password })
      
      // Show success message and redirect
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Registration successful! Please login." } 
        })
      }, 1500)
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
      setErrors({ form: errorMessage })
      
      // Shake animation on error
      const formElement = document.getElementById('register-form')
      formElement?.classList.add('animate-shake')
      setTimeout(() => {
        formElement?.classList.remove('animate-shake')
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      {/* Animated Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-lg mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500">Join CollabNotes today</p>
        </div>

        {/* Register Card */}
        <div 
          id="register-form"
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl"
        >
          {/* Form Error */}
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600">{errors.form}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    touched.name && errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: null })
                  }}
                  onBlur={() => handleBlur('name')}
                  onKeyPress={handleKeyPress}
                />
                {touched.name && !errors.name && name.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    touched.email && errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: null })
                  }}
                  onBlur={() => handleBlur('email')}
                  onKeyPress={handleKeyPress}
                />
                {touched.email && !errors.email && email.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    touched.password && errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: null })
                  }}
                  onBlur={() => handleBlur('password')}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordCriteria.filter(c => c.test(password)).length >= 4 
                        ? 'text-emerald-600' 
                        : 'text-amber-600'
                    }`}>
                      {passwordCriteria.filter(c => c.test(password)).length}/5 criteria met
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordCriteria.filter(c => c.test(password)).length >= 4
                          ? 'bg-emerald-500'
                          : password.length > 0
                          ? 'bg-amber-500'
                          : 'bg-gray-200'
                      }`}
                      style={{ 
                        width: `${(passwordCriteria.filter(c => c.test(password)).length / 5) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-1 gap-1 mt-2">
                    {passwordCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-center text-xs">
                        {criterion.test(password) ? (
                          <CheckCircleIcon className="h-3 w-3 text-emerald-500 mr-1" />
                        ) : (
                          <XCircleIcon className="h-3 w-3 text-gray-300 mr-1" />
                        )}
                        <span className={criterion.test(password) ? 'text-gray-600' : 'text-gray-400'}>
                          {criterion.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    touched.confirmPassword && errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
                  }}
                  onBlur={() => handleBlur('confirmPassword')}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {touched.confirmPassword && !errors.confirmPassword && confirmPassword.length > 0 && password === confirmPassword && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={submit}
              disabled={isLoading}
              className="relative w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-xs text-gray-400">
          Already using CollabNotes?{' '}
          <Link to="/login" className="underline hover:text-gray-600">
            Sign in here
          </Link>
        </p>
      </div>

 
    </div>
  )
}