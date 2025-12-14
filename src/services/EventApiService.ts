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

// TODO: maybe it's best to use CreateEventForm for this method instead of 'omiting' the id from EventData?
export const createEvent = async (eventData: Omit<EventData, 'id'>) => {
    const response = await api.post('/events', eventData);
    return response.data;
};

export const deleteEvent = async (id: number) => {
    await api.delete(`/events/${id}`);
}