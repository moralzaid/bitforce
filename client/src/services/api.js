import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token and Demo Role
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trident_token');
    const demoRole = localStorage.getItem('trident_demo_role');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (demoRole) {
      config.headers['x-demo-role'] = demoRole;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  demoLogin: (role) => api.post('/auth/demo-login', { role }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// Simulation & Chaos endpoints
export const simulationAPI = {
  triggerBreach: (payload) => api.post('/simulate/breach', payload),
  triggerChaosTest: (payload) => api.post('/simulate/chaos-test', payload),
  resetSystemState: () => api.post('/simulate/reset'),
  getSystemState: () => api.get('/simulate/state'),
  uploadTestImage: (formData) => api.post('/simulate/upload-test-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Veterinary Module endpoints
export const veterinaryAPI = {
  getElephants: (params) => api.get('/elephants', { params }),
  getElephantById: (id) => api.get(`/elephants/${id}`),
  createElephant: (data) => api.post('/elephants', data),
  updateElephant: (id, data) => api.put(`/elephants/${id}`, data),
  updateMusthStatus: (id, data) => api.patch(`/elephants/${id}/musth-status`, data),
  deleteElephant: (id) => api.delete(`/elephants/${id}`)
};

// Engineering Module endpoints
export const engineeringAPI = {
  getNodes: () => api.get('/nodes'),
  getNodeById: (id) => api.get(`/nodes/${id}`),
  updateNodeStatus: (id, data) => api.patch(`/nodes/${id}/status`, data),
  runDiagnostics: (id) => api.post(`/nodes/${id}/diagnostics`)
};

// Agricultural Module endpoints
export const agricultureAPI = {
  getAgroZones: () => api.get('/agro-zones'),
  getAgroZoneById: (id) => api.get(`/agro-zones/${id}`),
  refillTank: (id, data) => api.patch(`/agro-zones/${id}/refill`, data),
  calibrateZone: (id, data) => api.patch(`/agro-zones/${id}/calibrate`, data)
};

// Incidents & Analytics endpoints
export const incidentsAPI = {
  getIncidents: (params) => api.get('/incidents', { params }),
  getIncidentById: (id) => api.get(`/incidents/${id}`),
  getAnalyticsOverview: () => api.get('/analytics/overview'),
  getDependencyProof: () => api.get('/analytics/dependency-proof')
};

export default api;
