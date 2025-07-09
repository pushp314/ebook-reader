import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Purchase, BookContextType } from '../types';
import { useAuth } from './AuthContext';
import { booksAPI, purchasesAPI } from '../services/api';

const BookContext = createContext<BookContextType | undefined>(undefined);


export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (user) {
      loadPurchases();
      loadPurchasedBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBooks();
      const booksData = response.results || response;
      setBooks(booksData.map(transformBookData));
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    if (!user) return;
    
    try {
      const response = await purchasesAPI.getPurchases();
      const purchasesData = response.results || response;
      setPurchases(purchasesData.map(transformPurchaseData));
    } catch (error) {
      console.error('Failed to load purchases:', error);
    }
  };

  const loadPurchasedBooks = async () => {
    if (!user) return;
    
    try {
      const response = await booksAPI.getPurchasedBooks();
      setPurchasedBooks(response.map(transformBookData));
    } catch (error) {
      console.error('Failed to load purchased books:', error);
    }
  };

  const transformBookData = (apiBook: any): Book => ({
    id: apiBook.id.toString(),
    title: apiBook.title,
    author: apiBook.author,
    description: apiBook.description,
    price: parseFloat(apiBook.price),
    coverImage: apiBook.cover_image,
    category: apiBook.category_name || apiBook.category,
    tags: apiBook.tags || [],
    pages: apiBook.pages,
    publishedDate: new Date(apiBook.published_date),
    rating: apiBook.average_rating || 0,
    reviews: apiBook.review_count || 0,
  });

  const transformPurchaseData = (apiPurchase: any): Purchase => ({
    id: apiPurchase.id.toString(),
    userId: apiPurchase.user.toString(),
    bookId: apiPurchase.book.toString(),
    amount: parseFloat(apiPurchase.amount),
    transactionId: apiPurchase.transaction_id,
    status: apiPurchase.status,
    userDetails: {
      name: apiPurchase.user_name,
      email: apiPurchase.user_email,
      phone: apiPurchase.user_phone,
    },
    createdAt: new Date(apiPurchase.created_at),
    approvedAt: apiPurchase.approved_at ? new Date(apiPurchase.approved_at) : undefined,
  });

  const purchaseBook = async (bookId: string, userDetails: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const purchaseData = {
        book: parseInt(bookId),
        transaction_id: userDetails.transactionId,
        user_name: userDetails.name,
        user_email: userDetails.email,
        user_phone: userDetails.phone,
      };
      
      await purchasesAPI.createPurchase(purchaseData);
      await loadPurchases();
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  const approvePurchase = async (purchaseId: string) => {
    try {
      await purchasesAPI.approvePurchase(purchaseId);
      await loadPurchases();
      await loadPurchasedBooks();
    } catch (error) {
      console.error('Failed to approve purchase:', error);
      throw error;
    }
  };

  const rejectPurchase = async (purchaseId: string) => {
    try {
      await purchasesAPI.rejectPurchase(purchaseId);
      await loadPurchases();
    } catch (error) {
      console.error('Failed to reject purchase:', error);
      throw error;
    }
  };

  const addBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      const apiBookData = {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        price: bookData.price,
        category: bookData.category,
        tags: bookData.tags,
        pages: bookData.pages,
        published_date: bookData.publishedDate.toISOString().split('T')[0],
        cover_image: bookData.coverImage,
      };
      
      await booksAPI.createBook(apiBookData);
      await loadBooks();
    } catch (error) {
      console.error('Failed to add book:', error);
      throw error;
    }
  };

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    try {
      await booksAPI.updateBook(id, bookData);
      await loadBooks();
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksAPI.deleteBook(id);
      await loadBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw error;
    }
  };

  return (
    <BookContext.Provider value={{
      books,
      purchasedBooks,
      purchases,
      searchTerm,
      selectedCategory,
      loading,
      setSearchTerm,
      setSelectedCategory,
      purchaseBook,
      approvePurchase,
      rejectPurchase,
      addBook,
      updateBook,
      deleteBook,
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};