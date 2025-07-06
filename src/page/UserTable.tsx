import React, { useState, useEffect } from 'react'
import { Save, X, Trash2, Edit, Plus } from 'lucide-react'
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
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editBalance, setEditBalance] = useState<number>(0)
  const [transactionAmount, setTransactionAmount] = useState<number>(0)
  const [fromUser, setFromUser] = useState<string>('')
  const [toUser, setToUser] = useState<string>('')
  const [expandedTransactions, setExpandedTransactions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)



console.log( setExpandedTransactions)
  const userOptions  = [
    '1thdr4...4c710n',
   'iwh3rs...379ac1',
  'r3v3rs...379ac1',
  'niqo9d...4r5bic',
    'r3v3rs...379ac1',
  'z9y8x7...m615k4',
  'a1b2c3...d4e5f6',
 'b3c4d5...e6f7g8',
'c5d6e7...f8g9h0',
 'd7e8f9...g0h1i2',
  'e9f0g1...h2i3j4',
  'f2g3h4...i5j6k7',
'g4h5i6...j7k8l9',
  'h6i7j8...k9l0m1',
 'i8j9k0...l1m2n3',
'j0k1l2...m3n4o5',
'k2l3m4...n5o6p7',
   'l4m5n6...o7p8q9',
];

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

  // useEffect(() => {
  //   fetchUsers()
  // }, [])

  useEffect(() => {
  fetchUsers()
  
  const timeoutId = setTimeout(() => {
    setLoading(false)
  }, 10000) // 10 second timeout
  
  return () => clearTimeout(timeoutId)
}, [])

  // Start editing a user's balance
  const startEditingBalance = (user: User) => {
    setEditingUser(user)
    setEditBalance(user.balance)
    setShowEditModal(true)
  }

  // Start adding a transaction
  const startAddingTransaction = (user: User) => {
    setEditingUser(user)
    setTransactionAmount(0)
    setFromUser('')
    setToUser('')
    setShowTransactionModal(true)
  }

  // Close modals
  const closeModals = () => {
    setShowEditModal(false)
    setShowTransactionModal(false)
    setEditingUser(null)
    setEditBalance(0)
    setTransactionAmount(0)
    setFromUser('')
    setToUser('')
    setIsSubmitting(false)
  }

  // Save balance changes only (no transaction)
  const saveBalance = async () => {
    if (!editingUser) return
    
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          balance: editBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)

      if (error) {
        console.error('Error updating balance:', error)
        alert('Error updating balance: ' + error.message)
      } else {
        alert('Balance updated successfully!')
        closeModals()
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating balance:', error)
      alert('Error updating balance')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add transaction with amount
  const addTransaction = async () => {
    if (!editingUser) return
    
    if (!fromUser || !toUser || transactionAmount === 0) {
      alert('Please enter valid From, To usernames and amount (can be negative)')
      return
    }

    setIsSubmitting(true)
    try {
      // Create the transaction object
      const newTransaction = {
        from: fromUser,
        to: toUser,
        amount: transactionAmount,
        timestamp: new Date().toISOString()
      }

      // Get current transactions
      const currentTransactions = editingUser.transactions || []
      const updatedTransactions = [...currentTransactions, newTransaction]

      // Update user with new transaction
      const { error } = await supabase
        .from('profiles')
        .update({ 
          transactions: updatedTransactions,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)

      if (error) {
        console.error('Error adding transaction:', error)
        alert('Error adding transaction: ' + error.message)
      } else {
        alert('Transaction added successfully!')
        closeModals()
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
                            onClick={() => startEditingBalance(user)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit Balance"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => startAddingTransaction(user)}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="Add Transaction"
                          >
                            <Plus className="h-4 w-4" />
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

      {/* Edit Balance Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252a47] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Edit User Balance</h2>
              <button
                onClick={closeModals}
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

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveBalance}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Update Balance'}</span>
                </button>
              </div>

              <button
                onClick={closeModals}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showTransactionModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252a47] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add Transaction</h2>
              <button
                onClick={closeModals}
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
                  From Username
                </label>
                <select
                  value={fromUser}
                  onChange={(e) => setFromUser(e.target.value)}
                  className="w-full bg-[#1a1e35] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#66e0c8] outline-none"
                >
                  <option value="">Select </option>
                  {userOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  To Username
                </label>
                <select
                  value={toUser}
                  onChange={(e) => setToUser(e.target.value)}
                  className="w-full bg-[#1a1e35] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#66e0c8] outline-none"
                >
                  <option value="">Select</option>
                  {userOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1a1e35] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#66e0c8] outline-none"
                  placeholder="Enter transaction amount (+ or -)"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={addTransaction}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>

              <button
                onClick={closeModals}
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