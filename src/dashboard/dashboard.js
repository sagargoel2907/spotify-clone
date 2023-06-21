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

const onPlaylistItemClick = (event, id) => {
    console.log('clicked');
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };
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
        playlistItem.addEventListener('click', (event) => onPlaylistItemClick(event, id));
        playlistItem.setAttribute('data-type', 'playlist');
        playlistItem.innerHTML = `
        <img src="${images[0].url}" alt="" class="rounded mb-2 object-contain shadow"/>
        <h2 class="text-base font-semibold truncate mb-2">${name}</h2>
        <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`
        playlistSection.appendChild(playlistItem);
    }
};

const formatDuration=(duration)=>{
    let minutes=Math.floor(duration / 60_000);
    let seconds=Math.floor(duration / 1000) % 60;
    minutes=minutes==0 ? "00":
        minutes<=9 ? "0" + minutes:minutes.toString();
    seconds=seconds==0 ? "00":
        seconds<=9 ? "0" + seconds:seconds.toString();
    return `${minutes}:${seconds}`;
        
};


const loadPlaylistTracks = async (playlistId) => {
    const playlist = await fetchData(`${ENDPOINTS.playlist}/${playlistId}`)
    const tracks = playlist.tracks;
    const playlistTracksection = document.querySelector("#tracks");
    let trackNo = 1;
    for (let trackItem of tracks.items) {
        let { id, artists, name, album, duration_ms } = trackItem.track;
        let track = document.createElement('section');
        track.className = "track grid grid-cols-[50px_2fr_1fr_50px] items-center gap-2 hover:bg-light-black p-2 gap-2";
        track.id = id;
        let image = album.images.find(img => img.height == 64);
        track.innerHTML = `
        <p class="flex self-start justify-self-center">${trackNo++}</p>
        <section class="grid grid-cols-[auto_1fr] gap-2">
            <img class="h-8 w-8" src="${image.url}" alt="${name}" />
            <section>
                <h2 class="text-xl text-white">${name}</h2>
                <p class="text-sm">${Array.from(artists, artist => artist.name).join(', ')}</p>
            </section>
        </section>
        <p>${album.name}</p>
        <p>${formatDuration(duration_ms)}</p>`;

        playlistTracksection.appendChild(track);
    }
playlistTracksection.addEventListener('scroll',stickTracksHeaderOnScroll);


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

const stickTracksHeaderOnScroll=()=>{
    const coverPage=document.querySelector('#cover-content');
    const tracksHeader=document.querySelector('#tracks-header');
    const tracks=document.querySelector('#tracks');
    alert();
    const { scrollTop } = event.target;
        if (scrollTop >= coverPage.offsetHeight) {
            // alert();
            tracksHeader.classList.add("sticky", "top-0", "bg-black-secondary");
        } else {
            tracksHeader.classList.remove("sticky", "top-0", "bg-black-secondary");
        }
}

const fillContentForPlaylist = (playlistId) => {
    const pageContents = document.querySelector("#page-contents");
    pageContents.innerHTML = `
    <header id="tracks-header" class="px-8 py-8">
        <nav>
        <ul class="grid grid-cols-[50px_2fr_1fr_50px] items-center gap-2 p-2">
            <li class="justify-self-center">#</li>
            <li>Title</li>
            <li>Album</li>
            <li>⏱</li>
        </ul>
        </nav>
    </header>
    <section class="px-8" id="tracks"></section>`;
    loadPlaylistTracks(playlistId);
};


const loadPlaylists = () => {
    loadPlaylist(ENDPOINTS.featuredPlaylist, "featured-playlist-items");
    loadPlaylist(ENDPOINTS.featuredPlaylist, "top-playlist-items");
};


const loadSection = (section) => {
    if (section.type == SECTIONTYPE.DASHBOARD) {
        const playlistTracksection = document.querySelector("#tracks");
       // alert(playlistTracksection);
        playlistTracksection?.removeEventListener('scroll',stickTracksHeaderOnScroll);
        
        fillContentForDashboard();
        loadPlaylists();
    }
    else if (section.type == SECTIONTYPE.PLAYLIST) {
        fillContentForPlaylist(section.playlist);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section, "", "");
    loadSection(section);

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