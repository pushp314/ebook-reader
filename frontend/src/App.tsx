import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookProvider } from './contexts/BookContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './components/home/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import BookCatalog from './components/books/BookCatalog';
import BookDetail from './components/books/BookDetail';
import BookReader from './components/reader/BookReader';
import UserLibrary from './components/user/UserLibrary';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="catalog" element={<BookCatalog />} />
              <Route path="book/:id" element={<BookDetail />} />
              <Route path="library" element={
                <ProtectedRoute>
                  <UserLibrary />
                </ProtectedRoute>
              } />
              <Route path="reader/:id" element={
                <ProtectedRoute>
                  <BookReader />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Routes>
        </Router>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;