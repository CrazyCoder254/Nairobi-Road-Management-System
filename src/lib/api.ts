import axios, { AxiosResponse } from 'axios';

// API Configuration and Services
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// Axios instance configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/';
    }
    throw new Error(error.response?.data?.message || error.message || 'API request failed');
  }
);

// API wrapper
const apiRequest = async (endpoint: string, method: string = 'GET', data?: any) => {
  try {
    const response = await api.request({
      url: endpoint,
      method,
      data,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'API request failed');
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', 'POST', { email, password });
    console.log('Logged in user:', response.user);

    if (response.token) {
      setToken(response.token);
    } else {
      console.warn("Login successful but token is missing in response.");
    }

    return response;
  },

  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
  }) => {
    return apiRequest('/auth/register', 'POST', data);
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    return apiRequest(`/vehicles?${queryParams}`);
  },

  create: async (data: {
    plateNumber: string;
    make: string;
    model: string;
    year: number;
    capacity: number;
    saccoId: string;
    vehicleType?: string;
    status?: string;
    color?: string;
    fuelType?: string;
    chassisNumber?: string;
    engineNumber?: string;
  }) => {
    return apiRequest('/vehicles', 'POST', data);
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/vehicles/${id}`, 'PUT', data);
  },

  delete: async (id: string) => {
    return apiRequest(`/vehicles/${id}`, 'DELETE');
  },
};

// Drivers API
export const driversAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    return apiRequest(`/drivers?${queryParams}`);
  },

  create: async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseExpiryDate: string;
    dateOfBirth: string;
    sacco: string;
  }) => {
    return apiRequest('/drivers', 'POST', data);
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/drivers/${id}`, 'PUT', data);
  },

  delete: async (id: string) => {
    return apiRequest(`/drivers/${id}`, 'DELETE');
  },

  assignVehicle: async (id: string, vehicleId: string) => {
    return apiRequest(`/drivers/${id}/assign-vehicle`, 'POST', { vehicleId });
  },
};

// Saccos API
export const saccosAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    return apiRequest(`/saccos?${queryParams}`);
  },

  create: async (data: {
    name: string;
    registrationNumber: string;
    contactPerson: { name: string; phone: string; email: string };
    officeLocation: { address: string; city: string; region: string };
  }) => {
    return apiRequest('/saccos', 'POST', data);
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/saccos/${id}`, 'PUT', data);
  },

  delete: async (id: string) => {
    return apiRequest(`/saccos/${id}`, 'DELETE');
  },
};

// Routes API
export const routesAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    return apiRequest(`/routes?${queryParams}`);
  },

  getStats: async () => {
    return apiRequest('/routes/stats');
  },

  create: async (data: {
    name: string;
    routeCode: string;
    startTerminus: string;
    endTerminus: string;
    distance: number;
    estimatedDuration: number;
    fareAmount: number;
    intermediateStops?: string[];
    operatingHours?: { start: string; end: string };
    description?: string;
  }) => {
    return apiRequest('/routes', 'POST', data);
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/routes/${id}`, 'PUT', data);
  },

  delete: async (id: string) => {
    return apiRequest(`/routes/${id}`, 'DELETE');
  },
};

// Terminuses API
export const terminusesAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    return apiRequest(`/terminuses?${queryParams}`);
  },

  getCapacity: async (id: string) => {
    return apiRequest(`/terminuses/${id}/capacity`);
  },

  create: async (data: {
    name: string;
    location: { address: string; city: string; region: string };
    capacity: number;
    facilities?: string[];
    operatingHours?: { start: string; end: string };
    contactPerson: { name: string; phone: string };
    description?: string;
  }) => {
    return apiRequest('/terminuses', 'POST', data);
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/terminuses/${id}`, 'PUT', data);
  },

  delete: async (id: string) => {
    return apiRequest(`/terminuses/${id}`, 'DELETE');
  },
};

// Payments API
export const paymentsAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    return apiRequest(`/payments?${queryParams}`);
  },

  getStats: async () => {
    return apiRequest('/payments/stats');
  },

  getOverdue: async () => {
    return apiRequest('/payments/overdue');
  },

  create: async (data: {
    amount: number;
    paymentType: string;
    description: string;
    dueDate: string;
    entityType: string;
    entityId: string;
  }) => {
    return apiRequest('/payments', 'POST', data);
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/payments/${id}`, 'PUT', data);
  },

  processPayment: async (id: string, data: { amount: number; paymentMethod: string; referenceNumber?: string }) => {
    return apiRequest(`/payments/${id}/process`, 'POST', data);
  },
};

// Documents API
export const documentsAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    return apiRequest(`/documents?${queryParams}`);
  },

  upload: async (formData: FormData) => {
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  },

  verify: async (id: string) => {
    return apiRequest(`/documents/${id}/verify`, 'POST');
  },

  reject: async (id: string, reason: string) => {
    return apiRequest(`/documents/${id}/reject`, 'POST', { reason });
  },
};