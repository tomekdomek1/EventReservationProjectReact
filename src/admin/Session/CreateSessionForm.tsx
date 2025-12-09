import type { Dayjs } from "dayjs";

export interface CreateSessionForm {
    name: string,
    description: string,
    startTime: Dayjs,
    duration: number,
    maxParticipants: number;
}