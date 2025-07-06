
import React, { useState } from 'react'
import { Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from "../assets/logo2.svg"


const AuthModal: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let result
      if (isLoginView) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.username, formData.email, formData.password)
      }

      setMessage(result.message)
      
      if (!result.success) {
        setLoading(false)
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '' })
    setMessage('')
  }

  const toggleView = () => {
    setIsLoginView(!isLoginView)
    resetForm()
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
      <div className="w-full max-w-md bg-[#1a1e35] rounded-lg shadow-xl overflow-hidden relative">

        <div className="p-8">
          <h1 className="text-center text-2xl font-medium text-[#66e0c8] mb-2">
            {isLoginView ? 'StackSocial Login' : 'Sign Up'}
          </h1>
          <div className='flex justify-center mb-2'>
<img src={logo} alt="logo" width={40} />
          </div>
           
          
          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              message.includes('successful') || message.includes('created')
                ? 'bg-green-900 text-green-200'
                : 'bg-red-900 text-red-200'
            }`}>
              {message}
            </div>
          )}
          
          <div onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="mb-4 relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#252a47] text-white rounded-md pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#66e0c8]"
                  required
                  disabled={loading}
                />
              </div>
            )}
            <div className="mb-4 relative">
              <Mail
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#252a47] text-white rounded-md pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#66e0c8]"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-2 relative">
              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#252a47] text-white rounded-md pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#66e0c8]"
                required
                disabled={loading}
              />
            </div>
            {/* {isLoginView && (
              <div className="mb-6 text-right">
                <a href="#" className="text-[#7cff4d] hover:underline text-sm">
                  Forgot password?
                </a>
              </div>
            )} */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full py-3 rounded-md bg-gradient-to-r from-[#4dc6ff] to-[#7cff4d] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isLoginView ? 'Login' : 'Sign Up')}
            </button>
            <div className="mt-4 text-center text-sm text-gray-400">
              {isLoginView
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleView}
                className="text-[#66e0c8] hover:underline"
                disabled={loading}
              >
                {isLoginView ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal