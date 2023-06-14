const CLIENT_ID = "ea1dcd85f8094f67b84892e19dbbe6f5";
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";
const ACCESS_TOKEN_KEY = "accessToken";
const APP_URL = "spotify-clone.sagargoel.repl.com";
const REDIRECT_URI = "spotify-clone.sagargoel.repl.co";

const authorizeUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scopes=${scopes}&show_dialog=true`;
    window.open(url, "login", "width=800,height=600");
};

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById("login-to-spotify");
    loginButton.addEventListener("click", authorizeUser);
});

window.addEventListener("onload", () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {

    }
});