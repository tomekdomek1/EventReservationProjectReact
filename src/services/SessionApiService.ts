import dayjs from 'dayjs';
import type { EventSession } from '../types/Session';
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