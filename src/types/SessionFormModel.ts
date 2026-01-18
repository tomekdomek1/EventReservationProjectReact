import { z } from "zod";
import type { EventData } from "./Event";
import dayjs, { type Dayjs } from "dayjs";

export const SessionFormModel = (eventDetails?: EventData | null) =>
  z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z.custom<Dayjs>((v) => dayjs.isDayjs(v) && v.isValid(), { 
        message: "Invalid start date" 
    }),
    duration: z.coerce.number().min(1, "Min 1 min"),
    maxParticipants: z.coerce.number().min(1, "Min 1 person"),
    currentReserved: z.coerce.number().optional().default(0)
  })
  .refine((data) => {
      if (!eventDetails || !data.startTime) return true;
      return data.startTime.isAfter(eventDetails.startTime) || data.startTime.isSame(eventDetails.startTime);
  }, {
      message: "Session cannot start before the event",
      path: ["startTime"]
  })
  .refine((data) => {
      if (!eventDetails || !data.startTime) return true;
      return data.startTime.isBefore(eventDetails.endTime);
  }, {
      message: "Session must start before the event ends",
      path: ["startTime"]
  });