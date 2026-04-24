import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-storage') 
            ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token 
            : null;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors (e.g., logout user)
        if (error.response?.status === 401) {
            // Optional: Clear storage and redirect to login
            // localStorage.removeItem('auth-storage');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
