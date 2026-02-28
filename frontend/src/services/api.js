const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get the token from browser storage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    // If the token is expired or invalid, boot the user to login
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Network error');
  }
  return response.json();
};

export const AuthService = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token); // Store key locally
    }
    return data;
  }
};

export const GrievanceService = {
  getAll: async (ward = 'All Wards') => {
    const url = ward !== 'All Wards' 
      ? `${API_BASE_URL}/grievances?ward=${encodeURIComponent(ward)}` 
      : `${API_BASE_URL}/grievances`;
      
    const response = await fetch(url, {
      headers: { ...getAuthHeader() } // Send the key!
    });
    return handleResponse(response);
  },
  // ... other methods updated with headers: getAuthHeader()
};