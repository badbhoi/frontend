import { useMutation,  useQueryClient } from '@tanstack/react-query'
import { apiService } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export const useAuthMutations = () => {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login(email, password),
    onSuccess: async () => {
      await refreshUser()
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      console.error('Login error:', error)
    }
  })

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      apiService.register(username, email, password),
    onError: (error: any) => {
      console.error('Registration error:', error)
    }
  })

  const logoutMutation = useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      queryClient.clear()
    }
  })

  return {
    loginMutation,
    registerMutation,
    logoutMutation
  }
}