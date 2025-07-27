// API Configuration and Services
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// API wrapper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      window.location.href = '/';
    }
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
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
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    capacity: number;
    sacco: string;
    vehicleType?: string;
    status?: string;
  }) => {
    return apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    });
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
    return apiRequest('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/drivers/${id}`, {
      method: 'DELETE',
    });
  },

  assignVehicle: async (id: string, vehicleId: string) => {
    return apiRequest(`/drivers/${id}/assign-vehicle`, {
      method: 'POST',
      body: JSON.stringify({ vehicleId }),
    });
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
    return apiRequest('/saccos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/saccos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/saccos/${id}`, {
      method: 'DELETE',
    });
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
    return apiRequest('/routes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/routes/${id}`, {
      method: 'DELETE',
    });
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
    return apiRequest('/terminuses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/terminuses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/terminuses/${id}`, {
      method: 'DELETE',
    });
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
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  processPayment: async (id: string, data: { amount: number; paymentMethod: string; referenceNumber?: string }) => {
    return apiRequest(`/payments/${id}/process`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  verify: async (id: string) => {
    return apiRequest(`/documents/${id}/verify`, {
      method: 'POST',
    });
  },

  reject: async (id: string, reason: string) => {
    return apiRequest(`/documents/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};
