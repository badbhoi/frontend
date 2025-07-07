import axios from 'axios'
import { supabase } from '../context/AuthContext'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
      config.headers.apikey = import.meta.env.VITE_SUPABASE_ANON_KEY
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle auth errors
      await supabase.auth.signOut()
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

// API functions
export const apiService = {
  // Auth functions
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async register(username: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          balance: 0
        }
      }
    })
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // User profile functions
  async getUserProfile(userId: string) {
    // Use Supabase directly like in your original code
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get user transactions separately if they're in a different table
  async getUserTransactions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.log('Transactions table might not exist or has different structure')
        return []
      }
      return data || []
    } catch (error) {
      console.log('Error fetching transactions:', error)
      return []
    }
  },

  // Get complete user profile with transactions
  async getUserProfileWithTransactions(userId: string) {
    try {
      // Get profile data
      const profile = await this.getUserProfile(userId)
      
      // Try to get transactions from separate table first
      let transactions = await this.getUserTransactions(userId)
      
      // If no transactions from separate table, use the transactions column from profile
      if (!transactions || transactions.length === 0) {
        transactions = profile.transactions || []
      }
      
      return {
        ...profile,
        transactions
      }
    } catch (error) {
      console.error('Error fetching complete profile:', error)
      throw error
    }
  },

  async getAllUsers() {
    // Use Supabase directly like in your original code
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateUserProfile(userId: string, updates: Partial<{
    username: string
    email: string
    balance: number
  }>) {
   
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) throw error
    return data
  },

  async deleteUser(userId: string) {
    // Use Supabase directly like in your original code
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (error) throw error
    return data
  },

  async updateUserBalance(userId: string, newBalance: number) {
    // Use Supabase directly like in your original code
    const { data, error } = await supabase
      .from('profiles')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) throw error
    return data
  },

  async getUsersSummary() {
    // Use Supabase directly like in your original code
    const { data, error } = await supabase
      .from('profiles')
      .select('balance')

    if (error) throw error

    const totalUsers = data?.length || 0
    const totalBalance = data?.reduce((sum: number, user: any) => sum + (user.balance || 0), 0) || 0

    return {
      totalUsers,
      totalBalance,
      users: data
    }
  }
}