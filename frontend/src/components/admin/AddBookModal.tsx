import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBooks } from '../../contexts/BookContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface AddBookModalProps {
  onClose: () => void;
}

interface BookFormData {
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  tags: string;
  pages: number;
  coverImage: string;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addBook } = useBooks();
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookFormData>();

  const onSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    try {
      await addBook({
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()),
        publishedDate: new Date(),
        rating: 0,
        reviews: 0,
      });
      onClose();
    } catch (error) {
      console.error('Failed to add book:', error);
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
          <h2 className="text-2xl font-bold text-gray-900">Add a New Book</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <input {...register('title', { required: true })} placeholder="Title" className="w-full p-3 border rounded-md" />
          {errors.title && <span className="text-red-500">Title is required</span>}
          <input {...register('author', { required: true })} placeholder="Author" className="w-full p-3 border rounded-md" />
          {errors.author && <span className="text-red-500">Author is required</span>}
          <textarea {...register('description', { required: true })} placeholder="Description" className="w-full p-3 border rounded-md" rows={4}></textarea>
          {errors.description && <span className="text-red-500">Description is required</span>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('price', { required: true, valueAsNumber: true })} type="number" step="0.01" placeholder="Price" className="w-full p-3 border rounded-md" />
            <input {...register('pages', { required: true, valueAsNumber: true })} type="number" placeholder="Pages" className="w-full p-3 border rounded-md" />
          </div>
          <input {...register('category', { required: true })} placeholder="Category" className="w-full p-3 border rounded-md" />
          <input {...register('tags', { required: true })} placeholder="Tags (comma-separated)" className="w-full p-3 border rounded-md" />
          <input {...register('coverImage', { required: true })} placeholder="Cover Image URL" className="w-full p-3 border rounded-md" />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isSubmitting ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddBookModal;