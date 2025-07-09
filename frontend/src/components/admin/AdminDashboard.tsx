import React, { useState } from 'react';
import { useBooks } from '../../contexts/BookContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpenIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import AddBookModal from './AddBookModal';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { books, purchases } = useBooks();
  const { user } = useAuth();
  const [showAddBook, setShowAddBook] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-600">You must be an admin to view this page.</p>
      </div>
    );
  }

  const totalRevenue = purchases.reduce((acc, p) => acc + p.amount, 0);

  const stats = [
    { name: 'Total Books', value: books.length, icon: BookOpenIcon },
    { name: 'Total Purchases', value: purchases.length, icon: ShoppingCartIcon },
    { name: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: CurrencyDollarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setShowAddBook(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Book
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Purchases</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Book</th>
                  <th className="text-left py-2">User</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.slice(0, 10).map(purchase => {
                  const book = books.find(b => b.id === purchase.bookId);
                  return (
                    <tr key={purchase.id} className="border-b">
                      <td className="py-3">{book?.title || 'Unknown Book'}</td>
                      <td className="py-3">{purchase.userDetails.email}</td>
                      <td className="py-3">${purchase.amount.toFixed(2)}</td>
                      <td className="py-3">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showAddBook && <AddBookModal onClose={() => setShowAddBook(false)} />}
    </div>
  );
};

export default AdminDashboard;