import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBooks } from '../../contexts/BookContext';
import { useAuth } from '../../contexts/AuthContext';
import { Book } from '../../types';
import { XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface PurchaseModalProps {
  book: Book;
  onClose: () => void;
}

interface PurchaseFormData {
  name: string;
  email: string;
  phone: string;
  transactionId: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ book, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { purchaseBook } = useBooks();
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<PurchaseFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data: PurchaseFormData) => {
    setIsSubmitting(true);
    try {
      await purchaseBook(book.id, data);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-md text-gray-600">by {book.author}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">₹{book.price.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <input {...register('name', { required: true })} placeholder="Full Name" className="w-full p-3 border rounded-md" />
            {errors.name && <span className="text-red-500">Name is required</span>}
            <input {...register('email', { required: true })} placeholder="Email Address" className="w-full p-3 border rounded-md" />
            {errors.email && <span className="text-red-500">Email is required</span>}
            <input {...register('phone')} placeholder="Phone Number" className="w-full p-3 border rounded-md" />
            <input {...register('transactionId', { required: true })} placeholder="Transaction ID" className="w-full p-3 border rounded-md" />
            {errors.transactionId && <span className="text-red-500">Transaction ID is required</span>}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isSubmitting ? (
                <>
                  <motion.div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-6 w-6 mr-2" />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseModal;