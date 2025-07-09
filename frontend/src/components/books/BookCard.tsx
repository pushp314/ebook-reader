import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { StarIcon, ShoppingCartIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
  isPurchased: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, isPurchased }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
      whileHover={{ y: -5 }}
    >
      <Link to={`/book/${book.id}`} className="block">
        <div className="relative">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
          <div className="flex items-center mt-2">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{book.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 ml-2">({book.reviews} reviews)</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-bold text-blue-600">₹{book.price.toFixed(2)}</p>
            {isPurchased ? (
              <div className="flex items-center text-green-600">
                <BookOpenIcon className="h-5 w-5 mr-1" />
                <span className="text-sm font-semibold">Read Now</span>
              </div>
            ) : (
              <div className="flex items-center text-blue-600">
                <ShoppingCartIcon className="h-5 w-5 mr-1" />
                <span className="text-sm font-semibold">Buy Now</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;