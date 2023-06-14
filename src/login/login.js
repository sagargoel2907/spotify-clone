const CLIENT_ID = "ea1dcd85f8094f67b84892e19dbbe6f5";
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";
const ACCESS_TOKEN_KEY = "accessToken";
const APP_URL = "https://spotify-clone.sagargoel.repl.co";
const REDIRECT_URI = "https://spotify-clone.sagargoel.repl.co/login/login.html";

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
    window.location.href = `${APP_URL}/dashboard/dashboard.html`;
  }

  if (window.opener && !window.opener.closed) {
    window.focus();
    if (window.location.href.includes("error")) {
      window.close();
    }
    const searchParams = new URLSearchParams(window.location.hash);
    const accessToken = searchParams.get("access_token");
    const tokenType = searchParams.get("token_type");
    const expiresIn = searchParams.get("expires_in");

    if (accessToken) {
      window.close();
      window.opener.setItemInLocalStorage({ accessToken, tokenType, expiresIn });
    }
    else {
      window.close();
    }
  }
});