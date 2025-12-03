import type { Dayjs } from "dayjs";

export interface CreateSessionForm {
    name: string,
    description: string,
    startTime: Dayjs,
    durationInMinutes: number,
    maxParticipants: number;
}