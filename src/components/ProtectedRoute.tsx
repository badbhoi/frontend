
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()



    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1e35]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return user ? <>{children}</> : <AuthModal />
}

export default ProtectedRoute