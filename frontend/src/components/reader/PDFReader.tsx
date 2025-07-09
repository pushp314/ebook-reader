import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../../contexts/BookContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon,
  BookOpenIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const PDFReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books, purchasedBooks } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const book = books.find(b => b.id === id);
  const isPurchased = purchasedBooks.some(b => b.id === id);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!book) {
      setError("Book not found.");
      setLoading(false);
      return;
    }
    
    if (!isPurchased) {
      setError("You need to purchase this book to read it.");
      setLoading(false);
      return;
    }

    // In a real app, ensure this URL is secure and accessible
    const bookUrl = book?.fileUrl || 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
    setPdfFile(bookUrl);
    setLoading(false);

  }, [user, book, isPurchased, id, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-700 font-semibold">Loading your book...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !pdfFile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <DocumentIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Error Loading Book</h2>
          <p className="text-gray-600 mt-2">{error || 'Could not load the PDF file.'}</p>
          <button
            onClick={() => navigate('/library')}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    // Use a flex column layout with a fixed screen height
    <div className="h-screen bg-gray-200 flex flex-col">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-md px-4 py-3 flex items-center justify-between z-10 flex-shrink-0"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate('/library')}
            className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HomeIcon className="h-6 w-6" />
          </motion.button>
          <div className="border-l pl-4">
            <h1 className="text-lg font-bold text-gray-800 truncate max-w-xs">
              {book?.title}
            </h1>
            <p className="text-sm text-gray-500">by {book?.author}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           <Link to="/catalog" className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
            <BookOpenIcon className="h-6 w-6" />
           </Link>
        </div>
      </motion.header>

      {/* PDF Viewer using iframe */}
      {/* This container will grow to fill the available space */}
      <div className="flex-1 p-4 overflow-y-auto">
        <iframe
          src={`${pdfFile}#view=fitH`} // Added a fragment to suggest fitting the width
          title={book?.title || 'PDF Reader'}
          className="w-full h-full border-2 border-gray-300 rounded-lg shadow-lg"
        />
      </div>

      {/* Simplified Footer Navigation */}
       <motion.footer
        className="bg-white border-t p-3 text-center flex-shrink-0"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p className="text-sm text-gray-600">
          You are viewing "{book?.title}". Use browser controls for navigation and zoom.
        </p>
      </motion.footer>
    </div>
  );
};

export default PDFReader;
