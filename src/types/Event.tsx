import { Dayjs } from "dayjs";

export interface Event {
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