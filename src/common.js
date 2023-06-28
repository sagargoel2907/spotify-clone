export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const TOKEN_TYPE = "TOKEN_TYPE";
export const EXPIRES_IN = "EXPIRES_IN";
export const LOADED_PLAYLIST = "LOADED_PLAYLIST";
export const ENDPOINTS = {
    userProfile: "me",
    featuredPlaylist: "browse/featured-playlists?limit=50",
    topLists: "browse/categories/toplists/playlists?limit=50",
    playlist: "playlists"
}

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_TYPE);
    localStorage.removeItem(EXPIRES_IN);
    window.location.href = import.meta.env.VITE_APP_URL;
};

export const setItemInLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getItemFromLocalStorage = async (key, value) => JSON.parse(localStorage.getItem(key, JSON.stringify(value)));


export const SECTIONTYPE = {
    DASHBOARD: "DASHBOARD",
    PLAYLIST: "PLAYLIST"
}