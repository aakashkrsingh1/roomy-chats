import axios from 'axios';
export const baseURL= import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const httpClient = axios.create({
    baseURL : baseURL
});