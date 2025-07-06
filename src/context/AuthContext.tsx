import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'



export const supabase = createClient(supabaseUrl, supabaseKey)

interface User {
  id: string
  username?: string
  email: string
  balance?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }



const refreshUser = useCallback(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // Use session data first, then optionally fetch fresh profile data
      const cachedUser = {
        id: session.user.id,
        email: session.user.email!,
        username: session.user.user_metadata?.username,
        balance: session.user.user_metadata?.balance
      }
      
      // Set user immediately from session cache
      setUser(cachedUser)
      
      // Optionally fetch fresh data in background (don't await)
      fetchUserProfile(session.user.id).then(profile => {
        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: profile.username,
            balance: profile.balance
          })
        }
      })
    } else {
      setUser(null)
    }
  } catch (error) {
    console.error('Error refreshing user:', error)
    setUser(null)
  }
}, [])

  

useEffect(() => {
  // Get initial session (this is cached by Supabase)
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      // Set user immediately from session
      setUser({
        id: session.user.id,
        email: session.user.email!,
        username: session.user.user_metadata?.username,
        balance: session.user.user_metadata?.balance
      })
    } else {
      setUser(null)
    }
    setLoading(false)
  })

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.username,
          balance: session.user.user_metadata?.balance
        })
      } else {
        setUser(null)
      }
    }
  )

  return () => subscription.unsubscribe()
}, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, message: error.message }
      }

      if (data.user) {
        await refreshUser()
        return { success: true, message: 'Login successful!' }
      }

      return { success: false, message: 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }



  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          balance: 0 // Set default balance
        }
      }
    })

    if (error) {
      return { success: false, message: error.message }
    }

    if (data.user) {
      return { success: true, message: 'Account created successfully! Please check your email to verify your account.' }
    }

    return { success: false, message: 'Registration failed' }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, message: 'Network error. Please try again.' }
  }
}

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}