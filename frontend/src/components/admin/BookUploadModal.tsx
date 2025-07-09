import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBooks } from '../../contexts/BookContext';
import { XMarkIcon, CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface BookUploadModalProps {
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
  pdfFile: FileList;
}

const BookUploadModal: React.FC<BookUploadModalProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addBook } = useBooks();
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookFormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid PDF file.');
      e.target.value = '';
    }
  };

  const onSubmit = async (data: BookFormData) => {
    if (!selectedFile) {
      alert('Please upload a PDF file.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addBook({
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()),
        publishedDate: new Date(),
        rating: 0,
        reviews: 0,
        fileUrl: URL.createObjectURL(selectedFile),
      });
      onClose();
    } catch (error) {
      console.error('Failed to upload book:', error);
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
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Upload a New Book</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div {...register('pdfFile', { required: true })} className="flex items-center justify-center w-full">
            <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {selectedFile ? (
                  <>
                    <DocumentIcon className="w-10 h-10 mb-3 text-green-500" />
                    <p className="mb-2 text-sm text-gray-700 font-semibold">{selectedFile.name}</p>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF only (MAX. 50MB)</p>
                  </>
                )}
              </div>
              <input id="pdf-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
            </label>
          </div>
          {errors.pdfFile && <p className="text-red-500 text-sm">A PDF file is required.</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('title', { required: true })} placeholder="Title" className="w-full p-3 border rounded-md" />
            <input {...register('author', { required: true })} placeholder="Author" className="w-full p-3 border rounded-md" />
          </div>
          <textarea {...register('description', { required: true })} placeholder="Description" className="w-full p-3 border rounded-md" rows={3}></textarea>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input {...register('price', { required: true, valueAsNumber: true })} type="number" step="0.01" placeholder="Price" className="w-full p-3 border rounded-md" />
            <input {...register('pages', { required: true, valueAsNumber: true })} type="number" placeholder="Pages" className="w-full p-3 border rounded-md" />
            <input {...register('category', { required: true })} placeholder="Category" className="w-full p-3 border rounded-md" />
          </div>
          <input {...register('tags', { required: true })} placeholder="Tags (comma-separated)" className="w-full p-3 border rounded-md" />
          <input {...register('coverImage', { required: true })} placeholder="Cover Image URL" className="w-full p-3 border rounded-md" />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Book'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BookUploadModal;