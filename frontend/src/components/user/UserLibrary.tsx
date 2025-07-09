import React, { useState, useMemo } from 'react';
import { useBooks } from '../../contexts/BookContext';
import { useAuth } from '../../contexts/AuthContext';
import BookCard from '../books/BookCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const UserLibrary: React.FC = () => {
  const { purchasedBooks, loading } = useBooks();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = useMemo(() => {
    return purchasedBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [purchasedBooks, searchTerm]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Please log in to see your library.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Library</h1>
          <div className="relative mb-8">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your library...</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <BookCard book={book} isPurchased={true} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <h3 className="text-xl font-semibold text-gray-800">Your library is empty.</h3>
                <p className="text-gray-500 mt-2">Explore the catalog to find your next great read!</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserLibrary;