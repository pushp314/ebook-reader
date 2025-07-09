export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  category: string;
  tags: string[];
  pages: number;
  publishedDate: Date;
  rating: number;
  reviews: number;
  fileUrl?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  bookId: string;
  amount: number;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  approvedAt?: Date;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  lastRead: Date;
  bookmarks: number[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface BookContextType {
  books: Book[];
  purchasedBooks: Book[];
  purchases: Purchase[];
  searchTerm: string;
  selectedCategory: string;
  loading: boolean;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  purchaseBook: (bookId: string, userDetails: any) => Promise<void>;
  approvePurchase: (purchaseId: string) => Promise<void>;
  rejectPurchase: (purchaseId: string) => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}