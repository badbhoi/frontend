import { useAuth } from "../context/AuthContext"
import { supabase } from "../context/AuthContext"

interface ApiResponse<T = any> {
  success: boolean
  data?: T | null  
  message?: string
  error?: string
}

export const useApi = () => {
  const { user, logout } = useAuth()

  
  const handleSupabaseOperation = async <T = any>(
    operation: () => Promise<{ data: T | null; error: any }>
  ): Promise<ApiResponse<T>> => {
    try {
      const { data, error } = await operation()

      if (error) {
 
        if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
          logout()
          return {
            success: false,
            message: 'Session expired. Please login again.'
          }
        }

        return {
          success: false,
          message: error.message || 'Operation failed',
          error: error.code || 'UNKNOWN_ERROR'
        }
      }

      return {
        success: true,
        data: data,
        message: 'Operation successful'
      }
    } catch (error) {
      console.error('API operation error:', error)
      return {
        success: false,
        message: 'Network error. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get user profile
  const getUserProfile = (userId?: string) => {
    const targetUserId = userId || user?.id
    if (!targetUserId) {
      return Promise.resolve({
        success: false,
        message: 'User ID is required'
      })
    }

    return handleSupabaseOperation(async () =>
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single()
    )
  }

  // Get all users (admin function)
  const getAllUsers = () => {
    return handleSupabaseOperation(async () =>
      await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
    )
  }

  // Update user profile
  const updateUserProfile = (userId: string, updates: Partial<{
    username: string
    email: string
    balance: number
  }>) => {
    return handleSupabaseOperation(async () =>
      await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    )
  }

  // Delete user
  const deleteUser = (userId: string) => {
    return handleSupabaseOperation(async () =>
      await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
    )
  }

  // Update user balance specifically
  const updateUserBalance = (userId: string, newBalance: number) => {
    return handleSupabaseOperation(async () =>
      await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    )
  }

  // Get users summary (total count and balance)
  const getUsersSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      const totalUsers = data?.length || 0
      const totalBalance = data?.reduce((sum, user) => sum + (user.balance || 0), 0) || 0

      return {
        success: true,
        data: {
          totalUsers,
          totalBalance,
          users: data
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get users summary'
      }
    }
  }

  return {
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    deleteUser,
    updateUserBalance,
    getUsersSummary,
    // Direct access to supabase for custom operations
    supabase
  }
}