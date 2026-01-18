import { api } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/Auth';

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/users/login', data);
    return response.data;
};

export const registerUser = async (data: RegisterRequest) => {
    return await api.post('/users/register', data);
};

export const logoutUser = async () => {
    return await api.post('/users/logout');
};
