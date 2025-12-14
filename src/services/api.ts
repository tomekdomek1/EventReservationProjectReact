import axios from "axios";

export const api = axios.create({
    baseURL: 'https://localhost:7247/api', // TODO: use env
    headers: {
        'Content-Type': 'application/json',
    },
});