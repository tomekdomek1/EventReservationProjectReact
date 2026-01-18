import dayjs from 'dayjs';
import type { EventSession } from '../types/Session';
import type { RegistrationData } from '../types/Registration';
import type { PaginatedResponse } from '../types/Pagination';
import { api } from './api';


export const fetcher = async (url: string): Promise<PaginatedResponse<EventSession>> => {
    const response = await api.get(url);

    const eventsSessions = response.data.items.map((item: EventSession) => ({
        ...item,
        startTime: dayjs(item.startTime),
    }));

    return {
        ...response.data,
        items: eventsSessions,
    };
};

export const fetchUserRegistrations = async (url: string): Promise<PaginatedResponse<RegistrationData>> => {
    const response = await api.get(url);

    const registrations = response.data.items.map((item: RegistrationData) => ({
        ...item,
        session: {
            ...item.session,
            startTime: dayjs(item.session.startTime)
        }
    }));

    return {
        ...response.data,
        items: registrations
    };
}

export const createSession = async (eventId: number, sessionData: Omit<EventSession, 'id'>) => {
    const response = await api.post(`/event/${eventId}/sessions`, sessionData);
    return response.data;
};

export const updateSession = async (sessionId: number, sessionData: Partial<Omit<EventSession, 'id'>>) => {
    const response = await api.put(`/sessions/${sessionId}`, sessionData);
    return response.data;
};


export const deleteSession = async (sessionId: number) => {
    await api.delete(`/sessions/${sessionId}`);
}

export const exportSession = async (sessionId: number) => {
    return await api.get(`/sessions/${sessionId}/export/json`, {
        responseType: 'blob'
    });
}

export const registerForSession = async (sessionId: number) => {
    const response = await api.post(`/session/${sessionId}/registrations`);
    return response.data;
}

export const unregisterFromSession = async (sessionId: number) => {
    const response = await api.delete(`/session/${sessionId}/registrations`);
    return response.data;
}