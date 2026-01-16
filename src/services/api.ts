import axios from "axios";
import { enqueueSnackbar } from "notistack";

export const api = axios.create({
    baseURL: 'https://localhost:7247/api', // TODO: use env
    headers: {
        'Content-Type': 'application/json',
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showApiError = (error: any, fallbackMessage: string) => {
    const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        fallbackMessage;

    enqueueSnackbar(message, {
        autoHideDuration: 5000,
        variant: "error",
    });
};
