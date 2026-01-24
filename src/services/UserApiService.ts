import { api } from './api';
import type { UserProfile } from '../types/User';

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await api.get('/users/profile');
    return response.data;
};

export const updateUserProfile = async (data: UserProfile): Promise<void> => {
    await api.put('/users/profile', data);
};

export const changePassword = async (data: any): Promise<void> => {
    await api.put('/users/change-password', data);
};

