export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
}

export interface AuthResponse {
    result: string; // JWT Token
    id: number;
    exception: null | unknown;
    status: number;
    isCanceled: boolean;
    isCompleted: boolean;
    isCompletedSuccessfully: boolean;
    creationOptions: number;
    asyncState: null | unknown;
    isFaulted: boolean;
}

export interface UserData {
    id: number;
    email: string;
    role?: string;
    exp?: number; // Expiration time
}

export interface DecodedToken {
    sub: string;
    email: string;
    IntId: string;
    role: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
}
