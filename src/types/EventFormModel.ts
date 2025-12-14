import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import * as z from "zod";

export const EventFormModel = z.object({
    name: z.string().min(8).max(100),
    description: z.string().max(500),
    startTime: z.custom<Dayjs>((v) => dayjs.isDayjs(v) && v.isValid(), { message: "Invalid start date" }),
    endTime: z.custom<Dayjs>((v) => dayjs.isDayjs(v) && v.isValid(), { message: "Invalid end date" }),
    location: z.string().min(8).max(100),
    eventEmail: z.string().email(),
    isOverLappingAllowed: z.boolean(),
    coordinatorName: z.string().min(3).max(100),
    coordinatorSurname: z.string().min(3).max(100),
    coordinatorPhone: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, 'invalid')
}).refine((data) => data.startTime && data.startTime.isAfter(dayjs()), {
    message: "Start time must be a future date",
    path: ["startTime"],
}).refine((data) => data.endTime && data.endTime.isAfter(dayjs()), {
    message: "End time must be a future date",
    path: ["endTime"],
}).refine((data) => data.startTime && data.endTime && data.endTime.isAfter(data.startTime), {
    message: "End time must be later than start time",
    path: ["endTime"],
});
