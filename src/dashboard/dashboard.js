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

const loadFeaturedPlaylist = async () => {
    const featuredPlaylist = await fetchData(ENDPOINTS.featuredPlaylist);
    const { playlists: { items } } = featuredPlaylist;
    let featuredPlaylistSection = document.getElementById('featured-playlist-items');
    for (const { name, description, images, id } of items) {
        const featuredPlaylistItem = document.createElement('section');
        featuredPlaylistItem.className = 'rounded border-2 border-solid p-4 hover:cursor-pointer';
        featuredPlaylistItem.id = id;
        featuredPlaylistItem.addEventListener('click', onPlaylistItemClick);
        featuredPlaylistItem.setAttribute('data-type', 'playlist');
        featuredPlaylistItem.innerHTML = `
        <img src="${images[0].url}" alt="" class="rounded mb-2 object-contain"/>
        <h2 class="text-base">${name}</h2>
        <h3 class="text-sm">${description}</h3>`
        featuredPlaylistSection.appendChild(featuredPlaylistItem);
    }
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