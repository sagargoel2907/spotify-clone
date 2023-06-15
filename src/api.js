import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE, logout } from "./common";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getAccessToken = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const expiresIn = localStorage.getItem(EXPIRES_IN);
    const tokenType = localStorage.getItem(TOKEN_TYPE);
    if (expiresIn > Date.now()) {
        return { accessToken, tokenType };
    }
    logout();
}

const createAPIConfig = ({ accessToken, tokenType }, method = "GET") => {
    return {
        headers: {
            Authorization: `${tokenType} ${accessToken}`
        },
        method
    };
};

export const fetchData = async (endpoint) => {
    const url = `${API_BASE_URL}/${endpoint}`;
    const response = await fetch(url, createAPIConfig(getAccessToken()));
    return response.json();
};

