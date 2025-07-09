import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../../contexts/BookContext';
import { useAuth } from '../../contexts/AuthContext';
import { StarIcon, ShoppingCartIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import PurchaseModal from './PurchaseModal';
import { motion } from 'framer-motion';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books, purchasedBooks } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const book = books.find(b => b.id === id);
  const isPurchased = purchasedBooks.some(b => b.id === id);

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Book not found</h2>
      </div>
    );
  }

  const handlePurchase = () => {
    if (user) {
      setShowPurchaseModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleRead = () => {
    navigate(`/reader/${book.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-xl text-gray-600 mt-2">by {book.author}</p>
              <div className="flex items-center mt-4">
                <StarIcon className="h-6 w-6 text-yellow-400" />
                <span className="text-lg text-gray-700 ml-2">{book.rating.toFixed(1)} ({book.reviews} reviews)</span>
              </div>
              <p className="text-gray-700 mt-6 leading-relaxed">{book.description}</p>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">₹{book.price.toFixed(2)}</span>
                {isPurchased ? (
                  <button
                    onClick={handleRead}
                    className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <BookOpenIcon className="h-6 w-6 mr-2" />
                    Read Now
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCartIcon className="h-6 w-6 mr-2" />
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {showPurchaseModal && <PurchaseModal book={book} onClose={() => setShowPurchaseModal(false)} />}
    </div>
  );
};

export default BookDetail;