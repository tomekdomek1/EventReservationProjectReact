export interface UserProfile {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
}

export interface User extends UserProfile {
    id: number;
    roles: string[];
}
