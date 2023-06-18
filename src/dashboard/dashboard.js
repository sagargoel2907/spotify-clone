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
        playlistItem.className = 'rounded border-2 border-solid p-4 hover:cursor-pointer bg-black-secondary hover:bg-light-black';
        playlistItem.id = id;
        playlistItem.addEventListener('click', onPlaylistItemClick);
        playlistItem.setAttribute('data-type', 'playlist');
        playlistItem.innerHTML = `
        <img src="${images[0].url}" alt="" class="rounded mb-2 object-contain shadow"/>
        <h2 class="text-base font-semibold truncate mb-2">${name}</h2>
        <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`
        playlistSection.appendChild(playlistItem);
    }
};

const fillContentForDashboard = () => {
    const pageContents = document.querySelector("#page-contents");
    const playlistMap = new Map(['featured playlist', 'featured-playlist-items'], ['top playlist', 'top-playlist-items']);
    let dashboardContent = "";
    for (let [type, id] of playlistMap) {
        dashboardContent += `<article>
        <h1 class="mb-4 capitalize font-bold text-2xl">${type}</h1>
        <section
          id="${id}"
          class="grid grid-cols-auto-fill-card gap-5"
        ></section>
      </article>`;
    }
    pageContents.innerHTML = dashboardContent;
};


const loadPlaylists = () => {
    loadPlaylist(ENDPOINTS.featuredPlaylist, "featured-playlist-items");
    loadPlaylist(ENDPOINTS.featuredPlaylist, "top-playlist-items");
};

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    fillContentForDashboard();
    loadPlaylists();
});

document.addEventListener('click', () => {
    const menu = document.getElementById("user-profile-menu");
    if (!menu.classList.contains("hidden")) {
        menu.classList.add("hidden");
    }
})