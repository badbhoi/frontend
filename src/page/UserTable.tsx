
import React, { useState, useEffect } from 'react'
import { Save, X, Trash2, Eye, EyeOff, Edit } from 'lucide-react'
import { supabase } from '../context/AuthContext'

interface Transaction {
  from: string
  to: string
  amount: number
  timestamp: string
}

interface User {
  id: string
  username: string
  email: string
  balance: number
  transactions: Transaction[]
  created_at: string
  updated_at: string
}

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editBalance, setEditBalance] = useState<number>(0)
  const [fromUser, setFromUser] = useState<string>('')
  const [toUser, setToUser] = useState<string>('')
  const [expandedTransactions, setExpandedTransactions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Start editing a user's balance
  const startEditing = (user: User) => {
    setEditingUser(user)
    setEditBalance(user.balance)
    setFromUser('')
    setToUser('')
    setShowEditModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowEditModal(false)
    setEditingUser(null)
    setEditBalance(0)
    setFromUser('')
    setToUser('')
    setIsSubmitting(false)
  }

  // Save balance changes using the database function
  const saveBalance = async () => {
    if (!editingUser) return
    
    if (!fromUser || !toUser) {
      alert('Please enter both From and To usernames')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.rpc('update_user_balance', {
        user_id: editingUser.id,
        new_balance: editBalance,
        from_user: fromUser,
        to_user: toUser
      })

      if (error) {
        console.error('Error updating balance:', error)
        alert('Error updating balance: ' + error.message)
      } else {
        alert('Balance updated successfully!')
        closeModal()
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating balance:', error)
      alert('Error updating balance')
    } finally {
      setIsSubmitting(false)
    }
  }

 
  const addTransaction = async () => {
    if (!editingUser) return
    
    if (!fromUser || !toUser) {
      alert('Please enter both From and To usernames')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.rpc('add_transaction', {
        user_id: editingUser.id,
        from_user: fromUser,
        to_user: toUser
      })

      if (error) {
        console.error('Error adding transaction:', error)
        alert('Error adding transaction: ' + error.message)
      } else {
        alert('Transaction added successfully!')
        closeModal()
        fetchUsers()
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Error adding transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user: ' + error.message)
      } else {
        alert('User deleted successfully!')
        fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  // Toggle transaction visibility
  const toggleTransactions = (userId: string) => {
    setExpandedTransactions(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1e35] flex items-center justify-center">
        <div className="text-white text-lg">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1e35] sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Users Table */}
        <div className="bg-[#252a47] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1e35]">
                <tr>
                  <th className="text-left py-4 px-6 text-[#66e0c8] font-medium">Username</th>
                  <th className="text-left py-4 px-6 text-[#66e0c8] font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-[#66e0c8] font-medium">Balance</th>
                  <th className="text-left py-4 px-6 text-[#66e0c8] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr className="border-b border-gray-700 hover:bg-[#2a2f4a]">
                      <td className="py-4 px-6">
                        <span className="text-white">{user.username}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white">{user.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white">${user.balance.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(user)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit Balance"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleTransactions(user.id)}
                            className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                            title="View Transactions"
                          >
                            {expandedTransactions.includes(user.id) ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Transactions Row */}
                    {expandedTransactions.includes(user.id) && (
                      <tr className="bg-[#1a1e35]">
                        <td colSpan={4} className="py-4 px-6">
                          <div className="text-white">
                            <h4 className="text-[#66e0c8] font-medium mb-2">Transaction History</h4>
                            {user.transactions && user.transactions.length > 0 ? (
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {user.transactions.map((transaction, index) => (
                                  <div key={index} className="bg-[#252a47] p-3 rounded text-sm">
                                    <div className="flex justify-between items-center">
                                      <span>
                                        <span className="text-gray-300">From:</span> <span className="text-white">{transaction.from}</span>
                                        {' → '}
                                        <span className="text-gray-300">To:</span> <span className="text-white">{transaction.to}</span>
                                      </span>
                                      <span className="text-[#66e0c8]">${transaction.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">
                                      {new Date(transaction.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No transactions yet</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No users found.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252a47] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Edit User Balance</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  User: {editingUser.username}
                </label>
                <p className="text-sm text-gray-400">Current Balance: ${editingUser.balance.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editBalance}
                  onChange={(e) => setEditBalance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1a1e35] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#66e0c8] outline-none"
                  placeholder="Enter new balance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  From Username
                </label>
                <input
                  type="text"
                  value={fromUser}
                  onChange={(e) => setFromUser(e.target.value)}
                  className="w-full bg-[#1a1e35] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#66e0c8] outline-none"
                  placeholder="Enter from username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  To Username
                </label>
                <input
                  type="text"
                  value={toUser}
                  onChange={(e) => setToUser(e.target.value)}
                  className="w-full bg-[#1a1e35] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#66e0c8] outline-none"
                  placeholder="Enter to username"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveBalance}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Update Balance'}</span>
                </button>
                
                <button
                  onClick={addTransaction}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Transaction Only'}
                </button>
              </div>

              <button
                onClick={closeModal}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}