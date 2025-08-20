const API_BASE_URL = 'http://localhost:8080/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Transaction {
  id?: number;
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
  type: 'INCOME' | 'EXPENSE';
  notes?: string;
}

interface Budget {
  id?: number;
  category: string;
  budgetLimit: number;
  spentAmount: number;
  month: number;
  year: number;
}

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setAuthToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  removeAuthToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          // For login/signup endpoints, don't redirect automatically
          if (endpoint.includes('/auth/login') || endpoint.includes('/auth/signup')) {
            throw new Error(errorData.message === 'Bad credentials' ? 'Invalid email or password' : errorData.message || 'Authentication failed');
          }
          // For other protected endpoints, redirect to login
          this.removeAuthToken();
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setAuthToken(response.token);
    return response;
  }

  async signup(name: string, email: string, password: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Transaction endpoints
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: number, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    return this.request<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Budget endpoints
  async getBudgets(): Promise<Budget[]> {
    return this.request<Budget[]>('/budgets');
  }

  async getBudgetsByMonth(month: number, year: number): Promise<Budget[]> {
    return this.request<Budget[]>(`/budgets/month/${month}/year/${year}`);
  }

  async createOrUpdateBudget(budget: Omit<Budget, 'id' | 'spentAmount'>): Promise<Budget> {
    return this.request<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async updateBudget(id: number, budget: Omit<Budget, 'id' | 'spentAmount'>): Promise<Budget> {
    return this.request<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget),
    });
  }

  async deleteBudget(id: number): Promise<void> {
    return this.request<void>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardData(): Promise<DashboardData> {
    return this.request<DashboardData>('/dashboard');
  }

  async getDashboardDataByDateRange(startDate: string, endDate: string): Promise<DashboardData> {
    return this.request<DashboardData>(`/dashboard/date-range?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new ApiService();
export type { Transaction, Budget, DashboardData, User };
