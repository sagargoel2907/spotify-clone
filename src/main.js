import { ACCESS_TOKEN } from "./common";

document.addEventListener('DOMContentLoaded', () => {
    console.log('running');
    if (localStorage.getItem(ACCESS_TOKEN)) {
        window.location.href = 'dashboard/dashboard.html';
    }
    else {
        window.location.href = 'login/login.html';
    }
});
