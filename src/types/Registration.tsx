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

export interface SessionParticipant {
    registrationId: number;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    registrationStatus: string;
    registeredAt: string;
}
