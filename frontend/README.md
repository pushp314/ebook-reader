# BookVault - Full-Stack E-book Platform

A comprehensive e-book platform built with Django REST Framework backend and React frontend, featuring user authentication, book management, purchase processing, and reading progress tracking.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI**: Beautiful, responsive design with sidebar navigation
- **Authentication**: JWT-based login/register with role-based access
- **Book Catalog**: Advanced search, filtering, and categorization
- **Interactive Reader**: Page-by-page reading with bookmarks and progress tracking
- **Purchase Flow**: Complete payment processing with QR code integration
- **User Dashboard**: Personal library with reading progress
- **Admin Panel**: Comprehensive management interface

### Backend (Django REST Framework)
- **RESTful API**: Complete API with authentication and permissions
- **User Management**: Custom user model with role-based access
- **Book Management**: CRUD operations with categories and reviews
- **Purchase System**: Payment processing with admin approval workflow
- **Reading Progress**: Track user progress with bookmarks
- **File Handling**: Secure book file storage and serving

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Hook Form for form handling
- Heroicons for icons

### Backend
- Django 4.2 with Django REST Framework
- JWT authentication with SimpleJWT
- PostgreSQL/SQLite database
- Pillow for image handling
- CORS headers for frontend integration

## 📦 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Database setup**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

# For PostgreSQL (production)
# DATABASE_URL=postgresql://username:password@localhost:5432/ebook_platform
```

### CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET/PUT /api/auth/profile/` - User profile management
- `POST /api/auth/token/refresh/` - JWT token refresh

### Books Endpoints
- `GET /api/books/` - List all books (with pagination)
- `POST /api/books/` - Create book (admin only)
- `GET /api/books/{id}/` - Get book details
- `PUT /api/books/{id}/` - Update book (admin only)
- `DELETE /api/books/{id}/` - Delete book (admin only)
- `GET /api/books/categories/` - List categories
- `GET /api/books/purchased/` - Get user's purchased books
- `GET /api/books/search/` - Search books

### Purchases Endpoints
- `GET /api/purchases/` - List purchases
- `POST /api/purchases/` - Create purchase
- `POST /api/purchases/{id}/approve/` - Approve purchase (admin)
- `POST /api/purchases/{id}/reject/` - Reject purchase (admin)
- `GET /api/purchases/statistics/` - Purchase statistics (admin)

## 🎨 UI Features

### Sidebar Navigation
- Collapsible sidebar with smooth animations
- Role-based menu items
- User profile display
- Active state indicators

### Book Reader
- Page-by-page navigation
- Bookmark system
- Reading progress tracking
- Adjustable font size
- Table of contents

### Admin Dashboard
- Purchase approval workflow
- Book management interface
- User statistics
- Revenue tracking

## 🔐 Security Features

- JWT token authentication with refresh
- Role-based access control
- CORS protection
- File upload validation
- SQL injection protection
- XSS protection

## 🚀 Deployment

### Backend Deployment

1. **Set production environment**:
   ```env
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   DATABASE_URL=postgresql://user:pass@localhost/dbname
   ```

2. **Collect static files**:
   ```bash
   python manage.py collectstatic
   ```

3. **Run with Gunicorn**:
   ```bash
   gunicorn ebook_platform.wsgi:application
   ```

### Frontend Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Serve static files** with your preferred web server

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@bookvault.com or create an issue in the repository.

## 🙏 Acknowledgments

- Django REST Framework team
- React team
- Tailwind CSS team
- All contributors and testers

---

**BookVault** - Your Digital Library Platform 📚