import type { EventSession } from "./Session";

export interface RegistrationData {
    id: number;
    userId: number;
    sessionId: number;
    createdAt: string;
    updatedAt: string;
    registrationStatus: number;
    session: EventSession;
}
