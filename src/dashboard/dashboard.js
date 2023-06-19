import { fetchData } from "../api";
import { ENDPOINTS, SECTIONTYPE, logout } from "../common";

const onProfileClick = (event) => {
    event.stopPropagation();
    const menu = document.getElementById("user-profile-menu");
    menu.classList.toggle("hidden");
    if (!menu.classList.contains("hidden")) {
        document.querySelector("#menu-logout-btn").addEventListener('click', logout);
    }
};

const onPlaylistItemClick = (event,id) => {
    console.log('clicked');
    const section = { type: SECTIONTYPE.PLAYLIST };
    history.pushState(section, "", `playlist/${id}`);
    loadSection(section);
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
        playlistItem.className = 'rounded p-4 hover:cursor-pointer bg-black-secondary hover:bg-light-black';
        playlistItem.id = id;
        playlistItem.addEventListener('click', (event,id)=> onPlaylistItemClick(event,id));
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
    const playlistMap = new Map([['featured playlist', 'featured-playlist-items'], ['top playlist', 'top-playlist-items']]);
    let dashboardContent = "";
    for (let [type, id] of playlistMap) {
        dashboardContent += `<article>
        <h1 class="m-4 capitalize font-bold text-2xl">${type}</h1>
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


const loadSection = (section) => {
    if (section.type == SECTIONTYPE.DASHBOARD) {
        fillContentForDashboard();
        loadPlaylists();
    }
    else {
        // load the playlist contents
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "");
    loadSection(section);
    fillContentForDashboard();
    loadPlaylists();

    document.addEventListener('click', () => {
        const menu = document.getElementById("user-profile-menu");
        if (!menu.classList.contains("hidden")) {
            menu.classList.add("hidden");
        }
    })

    document.querySelector(".content").addEventListener('scroll', (event) => {
        // alert();
        const header = document.querySelector('.header');
        // alert(JSON.stringify(event));
        // alert(header);
        const { scrollTop } = event.target;
        if (scrollTop >= header.offsetHeight) {
            // alert();
            header.classList.add("sticky", "top-0", "bg-black-secondary");
            header.classList.remove("bg-transparent");
        } else {
            header.classList.remove("sticky", "top-0", "bg-black-secondary");
            header.classList.add("bg-transparent");
        }
    })

});

window.addEventListener('popstate', (event) => { 
    loadSection(event.state);
});