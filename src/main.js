import { ACCESS_TOKEN } from "./common";
const APP_URL = import.meta.env.VITE_APP_URL;
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
        window.location.href = `${APP_URL}/dashboard/dashboard.html`;
    }
    else {
        window.location.href = `${APP_URL}/login/login.html`;
    }
});
