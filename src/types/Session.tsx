import type { Dayjs } from "dayjs";

export interface EventSession {
    id: number;
    name: string;
    description: string | null;
    startTime: Dayjs;
    duration: number;   
    maxParticipants: number;
    currentReserved: number; 
}
