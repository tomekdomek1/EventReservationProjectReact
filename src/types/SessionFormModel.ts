import { z } from "zod";
import type { EventData } from "./Event";
import dayjs from "dayjs";

export const SessionFormModel = (eventDetails?: EventData | null) =>
  z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable().refine(val => !!val && val.length > 0, "Required"),
    duration: z.coerce.number().min(1, "Min 1 min"),
    maxParticipants: z.coerce.number().min(1, "Min 1 person"),
    currentReserved: z.number()
  });
