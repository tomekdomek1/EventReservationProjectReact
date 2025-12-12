import { Dayjs } from "dayjs";

export interface EventData {
    id: number;
    name: string;
    description: string;
    startTime: Dayjs;
    endTime: Dayjs;
    location: string;
    eventEmail: string;
    isOverLappingAllowed: boolean;
    coordinatorName: string;
    coordinatorSurname: string;
    coordinatorPhone: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    pageCount: number;
}