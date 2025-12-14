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