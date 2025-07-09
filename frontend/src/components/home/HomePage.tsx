import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../contexts/BookContext';
import { useAuth } from '../../contexts/AuthContext';
import BookCard from '../books/BookCard';
import { BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { books, purchasedBooks, loading } = useBooks();
  const { user } = useAuth();

  const featuredBooks = books.slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        className="bg-blue-600 text-white text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold">Welcome to BookVault</h1>
        <p className="text-xl mt-4">Your personal digital library.</p>
        <Link to="/catalog">
          <motion.button
            className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Books <ArrowRightIcon className="h-5 w-5 ml-2" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Featured Books Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Books</h2>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured books...</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {featuredBooks.map(book => (
              <motion.div
                key={book.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <BookCard
                  book={book}
                  isPurchased={!!user && purchasedBooks.some(pb => pb.id === book.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <BookOpenIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Join Our Community</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Sign up today to start building your personal library, track your reading progress, and discover your next favorite book.
          </p>
          {!user && (
            <Link to="/register">
              <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;