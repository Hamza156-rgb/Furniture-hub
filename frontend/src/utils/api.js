import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const getMe        = ()     => API.get('/auth/me');

// ── Shops ─────────────────────────────────────────────────────────────────────
export const getShops    = (params) => API.get('/shops', { params });
export const getShop     = (id)     => API.get(`/shops/${id}`);
export const getMyShop   = ()       => API.get('/shops/my');
export const updateMyShop = (data)  => API.put('/shops/my', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getCities   = ()       => API.get('/shops/cities');

// ── Categories ────────────────────────────────────────────────────────────────
export const getShopCategories = (shopId) => API.get(`/categories/shop/${shopId}`);
export const createCategory    = (data)   => API.post('/categories', data);
export const updateCategory    = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory    = (id)     => API.delete(`/categories/${id}`);

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts      = (params) => API.get('/products', { params });
export const getShopProducts  = (shopId, params) => API.get(`/products/shop/${shopId}`, { params });
export const createProduct    = (data)   => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct    = (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct    = (id)     => API.delete(`/products/${id}`);

// ── User ──────────────────────────────────────────────────────────────────────
export const getProfile       = ()       => API.get('/users/profile');
export const updateProfile    = (data)   => API.put('/users/profile', data);
export const changePassword   = (data)   => API.put('/users/change-password', data);

export default API;
