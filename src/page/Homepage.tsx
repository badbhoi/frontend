import React, {  useState } from 'react'
import { CopyIcon, LogOut, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import TransactionsTable from '../components/Table'
import QueryForm from '../components/Form'
import logo from "../assets/logo2.svg"


const Homepage: React.FC = () => {
  const { user, logout } = useAuth()
  const [isQueryFormOpen, setIsQueryFormOpen] = useState(false)
 


  const handleOpenQueryForm = () => {
    setIsQueryFormOpen(true)
  }

  const handleCloseQueryForm = () => {
    setIsQueryFormOpen(false)
  }

  return (
    <div className="min-h-screen">
      
      <header className="bg-[#1a1e35] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* <Home className="h-8 w-8 text-[#66e0c8]" /> */}
              <img src={logo} alt="logo" width={40} />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12  ">
        <div className="sm:p-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-1  sm:gap-6 gap-3">
            {/* Profile Card */}
            <div className="bg-[#252a47] rounded-lg p-6">
              
              {user && (
                <div className="space-y-2">
                  <div className="text-white">
                    <h1 className='font-bold sm:text-3xl text-2xl capitalize'>Welcome back , {user.username}</h1>
                    <p className='font-medium'>Please review your account status below</p>
                  </div>
                </div>
              )}

       
            </div>
 <div className="bg-[#252a47] rounded-lg p-6 sm:grid-cols-2 grid sm:gap-10 grid-cols-1 gap-3">
              
              {user && (
                <div className="space-y-2 text-white">
                
                    <h1 className='font-bold sm:text-2xl text-lg'>Bitcoin Address Details</h1>
                  

                    <div className='bg-[#1a1e35] space-y-3 rounded-lg p-4 font-medium'>
                        <p>Address</p>
                        <span className='flex items-center gap-2'> 39o6E2....5tugdtD4
                        <button 
  onClick={() => {
    navigator.clipboard.writeText('1234567890');
    alert('Copied to clipboard!');
  }}
  className='text-gray-300 hover:text-white focus:outline-none'
  aria-label='Copy to clipboard'
>
  <CopyIcon size={16} />
  </button>
  </span>
                    </div>
                 
           
                </div>
              )}


                 {user && (
                <div className="space-y-2 text-white ">
                
                    <h1>Balance</h1>
                  

                    <div className='bg-[#1a1e35] p-4 rounded-lg '>
                       <span className="font-medium">Balance:</span> 
                       <h1 className='font-bold text-lg'>{user.balance?.toFixed(2) || '0.00'} BTC </h1>
                       
              
                    </div>
                 
           
                </div>
              )}
            
            <div className='max-w-[200px] w-full'>
  <button
                onClick={handleOpenQueryForm}
                className=" gap-2 mt-4 w-full px-4 py-2 bg-[#66e0c8] text-[#1a1e35] rounded-md hover:bg-[#5dd4bd] transition-colors font-medium flex items-center justify-center"
              >
                 <Send className="h-4 w-4" />
                Withdraw
              </button>
            </div>
            
            </div>
      
          </div>
        </div>

        <TransactionsTable />
      </main>

  
      {user && (
        <QueryForm
          isOpen={isQueryFormOpen}
          onClose={handleCloseQueryForm}
          
        />
      )}
    </div>
  )
}

export default Homepage