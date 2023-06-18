import { fetchData } from "../api";
import { ENDPOINTS, logout } from "../common";

const onProfileClick = (event) => {
    event.stopPropagation();
    const menu = document.getElementById("user-profile-menu");
    menu.classList.toggle("hidden");
    if (!menu.classList.contains("hidden")) {
        document.querySelector("#menu-logout-btn").addEventListener('click', logout);
    }
};

const onPlaylistItemClick = () => {
    console.log('clicked');
};

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("#default-image");
    const userProfileBtn = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name");

    const userProfile = await fetchData(ENDPOINTS.userProfile);
    const { display_name: displayName, images } = userProfile;
    displayNameElement.textContent = displayName;


    userProfileBtn.addEventListener("click", onProfileClick);
    if (images.length) {
        defaultImage.classList.add("hidden");
    } else {
        defaultImage.classList.remove("hidden");
    }
};

const loadPlaylist = async (endpoint, elementId) => {
    const playlist = await fetchData(endpoint);
    const { playlists: { items } } = playlist;
    let playlistSection = document.getElementById(elementId);
    for (const { name, description, images, id } of items) {
        const playlistItem = document.createElement('section');
        playlistItem.className = 'rounded border-2 border-solid p-4 hover:cursor-pointer';
        playlistItem.id = id;
        playlistItem.addEventListener('click', onPlaylistItemClick);
        playlistItem.setAttribute('data-type', 'playlist');
        playlistItem.innerHTML = `
        <img src="${images[0].url}" alt="" class="rounded mb-2 object-contain"/>
        <h2 class="text-base">${name}</h2>
        <h3 class="text-sm">${description}</h3>`
        playlistSection.appendChild(playlistItem);
    }
};


const loadPlaylists = () => {
    loadPlaylist(ENDPOINTS.featuredPlaylist, "featured-playlist-items");
    loadPlaylist(ENDPOINTS.featuredPlaylist, "top-playlist-items");
};

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    loadFeaturedPlaylist();
});

document.addEventListener('click', () => {
    const menu = document.getElementById("user-profile-menu");
    if (!menu.classList.contains("hidden")) {
        menu.classList.add("hidden");
    }
})