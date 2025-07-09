# E-book Platform Backend (Django REST Framework)

A comprehensive Django REST Framework backend for an e-book platform with user authentication, book management, purchase processing, and reading progress tracking.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Book Management**: CRUD operations for books with categories, reviews, and ratings
- **Purchase System**: Complete purchase flow with payment verification and admin approval
- **Reading Progress**: Track user reading progress with bookmarks and page tracking
- **Admin Panel**: Comprehensive admin interface for managing books, users, and purchases
- **API Documentation**: Well-documented REST API endpoints

## Quick Start

1. **Clone and Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Database Setup**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Run Development Server**:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET/PUT /api/auth/profile/` - User profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Books
- `GET /api/books/` - List all books
- `POST /api/books/` - Create book (admin only)
- `GET /api/books/{id}/` - Get book details
- `PUT /api/books/{id}/` - Update book (admin only)
- `DELETE /api/books/{id}/` - Delete book (admin only)
- `GET /api/books/categories/` - List categories
- `GET /api/books/{id}/reviews/` - Get book reviews
- `POST /api/books/{id}/reviews/` - Add review
- `GET /api/books/purchased/` - Get user's purchased books
- `GET /api/books/search/` - Search books

### Reading Progress
- `GET /api/books/progress/` - Get user's reading progress
- `GET /api/books/{id}/progress/` - Get progress for specific book
- `PUT /api/books/{id}/progress/` - Update reading progress

### Purchases
- `GET /api/purchases/` - List purchases
- `POST /api/purchases/` - Create purchase
- `GET /api/purchases/{id}/` - Get purchase details
- `POST /api/purchases/{id}/approve/` - Approve purchase (admin only)
- `POST /api/purchases/{id}/reject/` - Reject purchase (admin only)
- `GET /api/purchases/statistics/` - Purchase statistics (admin only)
- `GET /api/purchases/payment-methods/` - List payment methods

## Models

### User (Custom User Model)
- Email-based authentication
- Role-based access (user/admin)
- Profile information

### Book
- Title, author, description
- Price, cover image, book file
- Category and tags
- Pages, published date
- Rating and review system

### Purchase
- User and book relationship
- Payment tracking
- Status management (pending/approved/rejected)
- Admin approval workflow

### Reading Progress
- Current page tracking
- Bookmarks
- Completion status
- Progress percentage

## Admin Interface

Access the admin panel at `/admin/` with superuser credentials:
- Manage users and permissions
- Add/edit books and categories
- Review and approve purchases
- Monitor reading progress
- View statistics and reports

## Security Features

- JWT token authentication
- Role-based permissions
- CORS configuration
- File upload validation
- SQL injection protection
- XSS protection

## Production Deployment

1. **Environment Variables**:
   ```bash
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   DATABASE_URL=postgresql://user:pass@localhost/dbname
   ```

2. **Static Files**:
   ```bash
   python manage.py collectstatic
   ```

3. **Database**:
   ```bash
   python manage.py migrate
   ```

4. **Web Server**:
   ```bash
   gunicorn ebook_platform.wsgi:application
   ```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword",
    "password_confirm": "securepassword"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Get Books
```bash
curl -X GET http://localhost:8000/api/books/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Purchase
```bash
curl -X POST http://localhost:8000/api/purchases/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "book": 1,
    "transaction_id": "TXN123456",
    "user_name": "John Doe",
    "user_email": "user@example.com",
    "user_phone": "+1234567890"
  }'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.