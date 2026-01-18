import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
    baseURL: 'https://localhost:7247/api', // TODO: use env
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const showApiError = (error: any, fallbackMessage: string) => {
    const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        fallbackMessage;

    enqueueSnackbar(message, {
        autoHideDuration: 3000,
        variant: "error",
    });
};
