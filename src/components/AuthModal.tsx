


import React, { useState } from 'react'
import { Mail, Lock, User } from 'lucide-react'

import logo from "../assets/logo2.svg"
import { useAuthMutations } from './useApi'

const AuthModal: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const { loginMutation, registerMutation } = useAuthMutations()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isLoginView) {
        await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password
        })
      } else {
        await registerMutation.mutateAsync({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '' })
  }

  const toggleView = () => {
    setIsLoginView(!isLoginView)
    resetForm()
    // Reset mutation states
    loginMutation.reset()
    registerMutation.reset()
  }

  const isLoading = loginMutation.isPending || registerMutation.isPending
  const error = loginMutation.error || registerMutation.error
  const isSuccess = loginMutation.isSuccess || registerMutation.isSuccess

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-[#1a1e35] rounded-lg shadow-xl overflow-hidden relative">
        <div className="p-8">
          <h1 className="text-center text-2xl font-medium text-[#66e0c8] mb-2">
            {isLoginView ? 'StackSocial Login' : 'Sign Up'}
          </h1>
          <div className='flex justify-center mb-2'>
            <img src={logo} alt="logo" width={40} />
          </div>
          
          {error && (
            <div className="mb-4 p-3 rounded-md text-sm bg-red-900 text-red-200">
              {error.message}
            </div>
          )}

          {isSuccess && (
            <div className="mb-4 p-3 rounded-md text-sm bg-green-900 text-green-200">
              {isLoginView ? 'Login successful!' : 'Account created successfully! Please check your email to verify your account.'}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="mb-4 relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#252a47] text-white rounded-md pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#66e0c8]"
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="mb-4 relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#252a47] text-white rounded-md pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#66e0c8]"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-2 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#252a47] text-white rounded-md pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#66e0c8]"
                required
                disabled={isLoading}
              />
            </div>
        
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-gradient-to-r from-[#4dc6ff] to-[#7cff4d] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : (isLoginView ? 'Login' : 'Sign Up')}
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              {isLoginView ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleView}
                className="text-[#66e0c8] hover:underline"
                disabled={isLoading}
              >
                {isLoginView ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthModal