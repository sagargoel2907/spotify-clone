export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const TOKEN_TYPE = "TOKEN_TYPE";
export const EXPIRES_IN = "EXPIRES_IN";

export const ENDPOINTS = {
    userProfile: "me",
    featuredPlaylist: "browse/featured-playlists?limit=10",
    topLists: "browse/categories/toplists/playlists?limit=50"
}

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_TYPE);
    localStorage.removeItem(EXPIRES_IN);
    window.location.href = import.meta.env.VITE_APP_URL;
};

export const SECTIONTYPE={
    DASHBOARD:"DASHBOARD",
    PLAYLIST:"PLAYLIST"
}