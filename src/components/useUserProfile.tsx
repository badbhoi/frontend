import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export const useUserProfile = (userId?: string) => {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  return useQuery({
    queryKey: ['userProfile', targetUserId],
    queryFn: () => apiService.getUserProfileWithTransactions(targetUserId!),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: () => apiService.getAllUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserTransactions = (userId?: string) => {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  return useQuery({
    queryKey: ['userTransactions', targetUserId],
    queryFn: () => apiService.getUserTransactions(targetUserId!),
    enabled: !!targetUserId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserMutations = () => {
  const queryClient = useQueryClient()

  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      apiService.updateUserProfile(userId, updates),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user data
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['allUsers'] })
      queryClient.invalidateQueries({ queryKey: ['usersSummary'] })
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] })
      queryClient.invalidateQueries({ queryKey: ['usersSummary'] })
    }
  })

  const updateBalanceMutation = useMutation({
    mutationFn: ({ userId, balance }: { userId: string; balance: number }) =>
      apiService.updateUserBalance(userId, balance),
    onSuccess: (data, variables) => {
        console.log(data)
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['allUsers'] })
      queryClient.invalidateQueries({ queryKey: ['usersSummary'] })
    }
  })

  return {
    updateProfileMutation,
    deleteUserMutation,
    updateBalanceMutation
  }
}