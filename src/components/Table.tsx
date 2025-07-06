import React from 'react'
type Transaction = {
  id: string
  amount: number
  date: string
  recipient?: string
  sender?: string
}
const TransactionsTable: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: '1thdr4...4c710n',
      amount: -1.79642828,
      date: '2025-01-15',
      recipient: '1CcTB...Sxz7',
    },
    {
      id: 'iwh3rs...379ac1',
      amount: 1.79771063,
      date: '2025-01-14',
    },
    {
      id: 'r3v3rs...379ac1',
      amount: -1.79771063,
      date: '2025-01-13',
      recipient: '1HQFua...xilr6X',
    },
    {
      id: 'niqo9d...4r5bic',
      amount: -0.00128235,
      date: '2025-01-12',
    },
    {
      id: 'r3v3rs...379ac1',
      amount: 1.79771063,
      date: '2025-01-11',
      sender: '1JrQfU...H7tcMm',
    },
    {
      id: 'z9y8x7...m615k4',
      amount: -1.79771063,
      date: '2025-01-10',
      recipient: '1JrQfU...H7tcMm',
    },
  ]
  return (
    <div className="w-full max-w-4xl mx-auto sm:p-6 p-2 bg-[#171b2e] rounded-xl text-white mt-10">
      <h1 className="text-xl md:text-4xl font-bold mb-8">
        Recent Transactions
      </h1>
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
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-4 px-4 font-mono">{transaction.id}</td>
                <td className="py-4 px-4">
                  <div
                    className={`${transaction.amount < 0 ? 'text-red-400' : 'text-green-400'} font-mono`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount} BTC
                  </div>
                  {transaction.recipient && (
                    <div className="text-gray-500 text-sm">
                      to: {transaction.recipient}
                    </div>
                  )}
                  {transaction.sender && (
                    <div className="text-gray-500 text-sm">
                      from: {transaction.sender}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 font-mono">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default TransactionsTable;
