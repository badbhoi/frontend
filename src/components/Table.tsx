import React from 'react'
import { formatDate } from './formatDate'

interface TransactionsTableProps {
  check: any[] 
}


const TransactionsTable: React.FC<TransactionsTableProps> = ({ check }) => {   



  return (
    <div className="w-full max-w-4xl mx-auto sm:p-6 p-2 bg-[#171b2e] rounded-xl text-white mt-10">
      <h1 className="text-xl md:text-4xl font-bold mb-8">
        Recent Transactions
      </h1>

     {check && check.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-400 uppercase text-sm md:text-base border-b border-gray-700">
              <th className="text-left py-4 px-4">Transaction ID</th>
              <th className="text-left py-4 px-4">Amount</th>
              <th className="text-left py-4 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {check.map((transaction:any, index:number) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-4 px-4 font-mono">{transaction?.to}</td>
                <td className="py-4 px-4">
                  <div
                    className={`${transaction.amount < 0 ? 'text-red-400' : 'text-green-400'} font-mono`}
                  >
                    {transaction?.amount > 0 ? '+' : ''}
                    {transaction?.amount} BTC
                  </div>
                 
                    <div className="text-gray-500 text-sm">
                      to: 1HQFua...xilr6X
                    </div>
                
                  {transaction.sender && (
                    <div className="text-gray-500 text-sm">
                      from: {transaction.sender}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 font-mono">{formatDate(transaction.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> ) : (  <div className="text-center py-8">
          <p className="text-gray-400">No transactions found</p>
        </div>) }
    </div>
  )
}
export default TransactionsTable;
