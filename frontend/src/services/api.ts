const API_BASE_URL = 'http://localhost:8000/api';

// Token management
const getToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API client with automatic token refresh
class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401 && token) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          const newToken = getToken();
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return fetch(url, config);
        } else {
          clearTokens();
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access, refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return false;
  }

  async get(endpoint: string) {
    const response = await this.request(endpoint);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(endpoint: string) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });
    return response.ok;
  }

  async postFormData(endpoint: string, formData: FormData) {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login/', { email, password }),
  
  register: (userData: any) =>
    apiClient.post('/auth/register/', userData),
  
  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout/', { refresh: refreshToken }),
  
  getProfile: () =>
    apiClient.get('/auth/profile/'),
  
  updateProfile: (data: any) =>
    apiClient.put('/auth/profile/', data),
};

// Books API
export const booksAPI = {
  getBooks: (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient.get(`/books/${queryString}`);
  },
  
  getBook: (id: string) =>
    apiClient.get(`/books/${id}/`),
  
  createBook: (bookData: any) =>
    apiClient.post('/books/', bookData),
  
  updateBook: (id: string, bookData: any) =>
    apiClient.put(`/books/${id}/`, bookData),
  
  deleteBook: (id: string) =>
    apiClient.delete(`/books/${id}/`),
  
  getCategories: () =>
    apiClient.get('/books/categories/'),
  
  createCategory: (categoryData: any) =>
    apiClient.post('/books/categories/', categoryData),
  
  getBookReviews: (bookId: string) =>
    apiClient.get(`/books/${bookId}/reviews/`),
  
  addReview: (bookId: string, reviewData: any) =>
    apiClient.post(`/books/${bookId}/reviews/`, reviewData),
  
  getPurchasedBooks: () =>
    apiClient.get('/books/purchased/'),
  
  searchBooks: (query: string, category?: string) => {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    return apiClient.get(`/books/search/?${params}`);
  },
  
  getReadingProgress: () =>
    apiClient.get('/books/progress/'),
  
  getBookProgress: (bookId: string) =>
    apiClient.get(`/books/${bookId}/progress/`),
  
  updateBookProgress: (bookId: string, progressData: any) =>
    apiClient.put(`/books/${bookId}/progress/`, progressData),
};

// Purchases API
export const purchasesAPI = {
  getPurchases: () =>
    apiClient.get('/purchases/'),
  
  createPurchase: (purchaseData: any) =>
    apiClient.post('/purchases/', purchaseData),
  
  getPurchase: (id: string) =>
    apiClient.get(`/purchases/${id}/`),
  
  approvePurchase: (id: string) =>
    apiClient.post(`/purchases/${id}/approve/`, {}),
  
  rejectPurchase: (id: string) =>
    apiClient.post(`/purchases/${id}/reject/`, {}),
  
  getPaymentMethods: () =>
    apiClient.get('/purchases/payment-methods/'),
  
  getStatistics: () =>
    apiClient.get('/purchases/statistics/'),
};

export { setTokens, clearTokens };