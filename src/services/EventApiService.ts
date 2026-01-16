import dayjs from 'dayjs';
import type { EventData } from '../types/Event';
import type { PaginatedResponse } from '../types/Pagination';
import { api } from './api';


export const fetcher = async (url: string): Promise<PaginatedResponse<EventData>> => {
    const response = await api.get(url);

    const events = response.data.items.map((item: EventData) => ({
        ...item,
        startTime: dayjs(item.startTime),
        endTime: dayjs(item.endTime),
    }));

    return {
        ...response.data,
        items: events,
    };
};

export const getEvent = async (id: number): Promise<EventData> => {
    const response = await api.get(`/events/${id}`);
    return {
        ...response.data,
        startTime: dayjs(response.data.startTime),
        endTime: dayjs(response.data.endTime),
    };
};

// TODO: maybe it's best to use CreateEventForm for this method instead of 'omiting' the id from EventData?
export const createEvent = async (eventData: Omit<EventData, 'id'>) => {
    const response = await api.post('/events', eventData);
    return response.data;
};

export const updateEvent = async (id: number, eventData: Partial<Omit<EventData, 'id'>>) => {
    const response = await api.patch(`/events/${id}`, eventData);
    return response.data;
};


export const deleteEvent = async (id: number) => {
    await api.delete(`/events/${id}`);
}