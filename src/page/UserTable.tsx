// import  { useState, useEffect } from 'react'; // Import useEffect
// import { PencilIcon, CheckIcon, XIcon, PlusIcon } from 'lucide-react';

// interface UserData {
//   _id: string; // Changed from 'id' to '_id' to match MongoDB's default ID field
//   username: string;
//   amount: number;
//   isEditing?: boolean;
// }

// export function UserTable() {
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [newUser, setNewUser] = useState({
//     username: '',
//     amount: '',
//   });
//   const [editValues, setEditValues] = useState<{
//     [key: string]: string;
//   }>({});
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // --- Fetch Users on Component Mount ---
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('http://localhost:5000/api/users/all-users'); // Replace with your backend URL
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setUsers(data);
//     } catch (err: any) {
//       setError(`Failed to fetch users: ${err.message}`);
//       console.error("Failed to fetch users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (userId: string) => {
//     setUsers(
//       users.map((user) =>
//         user._id === userId
//           ? {
//               ...user,
//               isEditing: true,
//             }
//           : {
//               ...user,
//               isEditing: false, // Ensure only one user is in edit mode
//             },
//       ),
//     );
//     const userToEdit = users.find((user) => user._id === userId);
//     if (userToEdit) {
//       setEditValues({
//         ...editValues,
//         [userId]: userToEdit.amount.toString(),
//       });
//     }
//   };

//   const cancelEditing = (userId: string) => {
//     setUsers(
//       users.map((user) =>
//         user._id === userId
//           ? {
//               ...user,
//               isEditing: false,
//             }
//           : user,
//       ),
//     );
//     // Remove the temporary edit value for this user
//     const newEditValues = { ...editValues };
//     delete newEditValues[userId];
//     setEditValues(newEditValues);
//   };

//   const saveEdit = async (userId: string) => {
//     const newAmount = parseFloat(editValues[userId]);
//     if (isNaN(newAmount)) {
//       alert('Please enter a valid number for amount.');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/users/${userId}/amount`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add if you have auth middleware on this route
//         },
//         body: JSON.stringify({ amount: newAmount }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }

//       // Update the local state with the new amount
//       setUsers(
//         users.map((user) =>
//           user._id === userId
//             ? {
//                 ...user,
//                 amount: newAmount,
//                 isEditing: false,
//               }
//             : user,
//         ),
//       );
//       // Clean up edit value
//       const newEditValues = { ...editValues };
//       delete newEditValues[userId];
//       setEditValues(newEditValues);

//     } catch (err: any) {
//       alert(`Failed to update amount: ${err.message}`);
//       console.error("Failed to update amount:", err);
//     }
//   };

//   const handleEditChange = (userId: string, value: string) => {
//     setEditValues({
//       ...editValues,
//       [userId]: value,
//     });
//   };

//   const handleDeleteUser = async (userId: string) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) {
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add if you have auth middleware on this route
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }

//       // Remove the user from the local state
//       setUsers(users.filter((user) => user._id !== userId));
//       alert('User deleted successfully!');
//     } catch (err: any) {
//       alert(`Failed to delete user: ${err.message}`);
//       console.error("Failed to delete user:", err);
//     }
//   };

//   // The add user functionality remains frontend-only as per the current backend (no 'create user' route yet)
//   const handleAddUser = () => {
//     if (!newUser.username.trim()) {
//       alert('Please enter a username');
//       return;
//     }
//     const amountValue = parseFloat(newUser.amount);
//     if (isNaN(amountValue)) {
//       alert('Please enter a valid amount');
//       return;
//     }

//     // This part is for client-side addition only because there's no backend route for creating a user yet.
//     // If you add a POST /api/users route to your backend, you'd make an API call here.
//     const newId = (
//       Math.max(...users.map((u) => parseInt(u._id || '0')), 0) + 1 // Use _id from backend
//     ).toString();

//     setUsers([
//       ...users,
//       {
//         _id: newId, // Assign a temporary client-side ID or fetch from backend after creation
//         username: newUser.username,
//         amount: amountValue,
//       },
//     ]);
//     setNewUser({
//       username: '',
//       amount: '',
//     });
//     setShowAddForm(false);
//   };


//   if (loading) {
//     return <section className='h-screen max-w-4xl flex justify-center items-center mx-auto'><div>Loading users...</div></section>;
//   }

//   if (error) {
//     return <section className='h-screen max-w-4xl flex justify-center items-center mx-auto'><div className="text-red-500">Error: {error}</div></section>;
//   }


//   return (
//     <section className='h-screen max-w-4xl flex justify-center items-center mx-auto'>
//       <div className="bg-white rounded-lg shadow overflow-hidden w-full">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Username
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Amount
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {user.username}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.isEditing ? (
//                       <input
//                         type="number" // Use type="number" for amounts
//                         className="border rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         value={editValues[user._id] || ''}
//                         onChange={(e) => handleEditChange(user._id, e.target.value)}
//                       />
//                     ) : (
//                       `$${user.amount.toFixed(2)}`
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     {user.isEditing ? (
//                       <div className="flex justify-end space-x-2">
//                         <button
//                           onClick={() => saveEdit(user._id)}
//                           className="text-green-600 hover:text-green-900"
//                           aria-label="Save"
//                         >
//                           <CheckIcon size={18} />
//                         </button>
//                         <button
//                           onClick={() => cancelEditing(user._id)}
//                           className="text-red-600 hover:text-red-900"
//                           aria-label="Cancel"
//                         >
//                           <XIcon size={18} />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex justify-end space-x-2">
//                         <button
//                           onClick={() => startEditing(user._id)}
//                           className="text-blue-600 hover:text-blue-900"
//                           aria-label="Edit"
//                         >
//                           <PencilIcon size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteUser(user._id)}
//                           className="text-red-600 hover:text-red-900"
//                           aria-label="Delete"
//                         >
//                           <XIcon size={18} />
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {showAddForm ? (
//           <div className="p-4 border-t border-gray-200 bg-gray-50">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newUser.username}
//                 onChange={(e) =>
//                   setNewUser({
//                     ...newUser,
//                     username: e.target.value,
//                   })
//                 }
//               />
//               <input
//                 type="number" // Use type="number"
//                 placeholder="Amount"
//                 className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newUser.amount}
//                 onChange={(e) =>
//                   setNewUser({
//                     ...newUser,
//                     amount: e.target.value,
//                   })
//                 }
//               />
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleAddUser}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   Add
//                 </button>
//                 <button
//                   onClick={() => setShowAddForm(false)}
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="p-4 border-t border-gray-200">
//             <button
//               onClick={() => setShowAddForm(true)}
//               className="flex items-center text-blue-600 hover:text-blue-900"
//             >
//               <PlusIcon size={16} className="mr-1" />
//               <span>Add New User (Frontend only)</span>
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }




import React, { useState, useEffect } from 'react'
import { Save, X, Trash2 } from 'lucide-react'
import { supabase } from '../context/AuthContext'

interface User {
  id: string
  username: string
  email: string
  balance: number
  created_at: string
  updated_at: string
}

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editBalance, setEditBalance] = useState<number>(0)

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
    setEditingUser(user.id)
    setEditBalance(user.balance)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null)
    setEditBalance(0)
  }

  // Save balance changes
  const saveBalance = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          balance: editBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating balance:', error)
        alert('Error updating balance: ' + error.message)
      } else {
        alert('Balance updated successfully!')
        setEditingUser(null)
        fetchUsers() 
      }
    } catch (error) {
      console.error('Error updating balance:', error)
      alert('Error updating balance')
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
        fetchUsers() // Refresh the list
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
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-[#2a2f4a]">
                    <td className="py-4 px-6">
                      <span className="text-white">{user.username}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white">{user.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      {editingUser === user.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editBalance}
                          onChange={(e) => setEditBalance(parseFloat(e.target.value) || 0)}
                          className="bg-[#1a1e35] text-white px-2 py-1 rounded border border-gray-600 focus:border-[#66e0c8] outline-none w-24"
                        />
                      ) : (
                        <span className="text-white">${user.balance.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={() => saveBalance(user.id)}
                              className="p-1 text-green-400 hover:text-green-300 transition-colors"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(user)}
                              className="px-2 py-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                              title="Edit Balance"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
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
    </div>
  )
}