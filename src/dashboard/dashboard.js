import { fetchData } from "../api";
import { ENDPOINTS, LOADED_PLAYLIST, SECTIONTYPE, getItemFromLocalStorage, logout, setItemInLocalStorage } from "../common";



const audio = new Audio();
// let interval;
let currentSongId = "";

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
    const greetUser = document.querySelector("#greet-user");
    const defaultImage = document.querySelector("#default-image");
    const userProfileBtn = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name");

    const userProfile = await fetchData(ENDPOINTS.userProfile);
    const { display_name: displayName, images } = userProfile;
    displayNameElement.textContent = displayName;
    greetUser.textContent = displayName;


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

const formatDuration = (duration) => {
    let minutes = Math.floor(duration / 60_000);
    let seconds = Math.floor(duration / 1000) % 60;
    minutes = minutes <= 9 ? "0" + minutes : minutes.toString();
    seconds = seconds <= 9 ? "0" + seconds : seconds.toString();
    return `${minutes}:${seconds}`;

};

const onTrackSelection = (id, event) => {
    const tracks = document.querySelectorAll("#tracks .track");
    for (let track of tracks) {
        if (track.id == id) {
            track.classList.add("selected", "bg-gray");
        }
        else {
            track.classList.remove("selected", "bg-gray");
        }
    }
};

const onMetadataLoaded = () => {
    // console.log("hi");
    // alert("song clicked");
    totalDuration.textContent = `0:${audio.duration.toFixed(0)}`;
};


const togglePlayer = (event, { name, id, artistNames, duration_ms, image, previewUrl }) => {
    // alert([id, currentSongId]);
    const trackPlayButton = document.querySelector(`#play-track${id}`);
    if (currentSongId !== id) {
        onTrackPlay(event, { name, id, artistNames, duration_ms, image, previewUrl });
    }

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    currentSongId = id;
}

const onTrackPlay = (event, { name, id, artistNames, duration_ms, image, previewUrl }) => {
    const nowPlayingImage = document.querySelector('#now-playing-image');
    const nowPlayingName = document.querySelector('#now-playing-name');
    const nowPlayingArtists = document.querySelector('#now-playing-artists');
    nowPlayingImage.src = image.url;
    nowPlayingName.textContent = name;
    nowPlayingArtists.textContent = artistNames;
    // audio.removeEventListener("loadedmetadata", onMetadataLoaded);
    // audio.addEventListener("loadedmetadata", onMetadataLoaded);
    audio.src = previewUrl;
    // if (interval) clearInterval(interval);

    // audio.play();
}

const playPrevTrack = async () => {
    const { playlist, currentTrackIndex } = await getCurrentTrackIndex();
    if (currentTrackIndex > 0) {
        togglePlayer(null, playlist[currentTrackIndex - 1]);
    }
};
const playNextTrack = async () => {
    const { playlist, currentTrackIndex } = await getCurrentTrackIndex();
    if (currentTrackIndex + 1 < playlist.length) {
        togglePlayer(null, playlist[currentTrackIndex + 1]);
    }
};
const getCurrentTrackIndex = async () => {
    const playlist = await getItemFromLocalStorage(LOADED_PLAYLIST);
    const currentTrackIndex = playlist.findIndex(track => track.id == currentSongId);
    return { playlist, currentTrackIndex };
};

const loadPlaylistCoverPage = (playlist) => {
    const coverPage = document.querySelector("#cover-content");
    const { name, images: [image], description, tracks: { items } } = playlist;
    coverPage.innerHTML = `
        <img src="${image.url}" alt="" class="h-36 w-36" />
        <section class="flex items-start flex-col gap-2">
        <h1 class="text-4xl">${name}</h1>
        <h3>${description}</h3>
        <p>${items.length} songs</p>
        </section>`;
}

const loadPlaylistTracks = async (playlistId) => {
    const playlist = await fetchData(`${ENDPOINTS.playlist}/${playlistId}`)
    let loadedPlaylist = [];
    loadPlaylistCoverPage(playlist);
    const tracks = playlist.tracks;
    const playlistTracksection = document.querySelector("#tracks");
    let trackNo = 1;
    for (let trackItem of tracks.items) {
        const { id, artists, name, album, duration_ms, preview_url: previewUrl } = trackItem.track;
        const track = document.createElement('section');
        track.className = "track grid grid-cols-[50px_1fr_1fr_50px] items-center gap-2 hover:bg-light-black p-2 gap-4";
        track.id = id;
        const image = album.images.find(img => img.height == 64);
        const artistNames = Array.from(artists, artist => artist.name).join(', ')
        track.innerHTML = `
        <p class="flex self-start justify-self-center relative">
            <span class="track-no">${trackNo++}</span>
        </p>
        <section class="grid grid-cols-[auto_1fr] gap-2">
            <img class="h-8 w-8" src="${image.url}" alt="${name}" />
            <section>
                <h2 class="text-bas text-white line-clamp-1">${name}</h2>
                <p class="text-sm line-clamp-1">${artistNames}</p>
            </section>
        </section>
        <p class="line-clamp-1">${album.name}</p>
        <p>${formatDuration(duration_ms)}</p>`;
        const playButton = document.createElement("button");
        playButton.className = "play invisible absolute left-0";
        playButton.id = `play-track${id}`;
        playButton.innerHTML = `<span class="material-symbols-outlined"
        >play_arrow</span`;
        playButton.addEventListener('click', (event) => togglePlayer(event, { name, id, artistNames, duration_ms, image, previewUrl }))
        track.querySelector('p').appendChild(playButton);
        track.addEventListener("click", (event) => onTrackSelection(id, event))
        playlistTracksection.appendChild(track);
        loadedPlaylist.push({ name, id, artistNames, image, previewUrl });
    }
    setItemInLocalStorage(LOADED_PLAYLIST, loadPlaylist);
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

const stickTracksHeaderOnScroll = (event) => {
    const coverPage = document.querySelector('#cover-content');
    const tracksHeader = document.querySelector('#tracks-header');
    const header = document.querySelector('.header');
    // alert();
    const { scrollTop } = event.target;
    if (scrollTop >= coverPage.offsetHeight) {
        // alert();
        tracksHeader.classList.add("sticky", "bg-black-secondary", "px-8");
        tracksHeader.classList.remove("mx-8")
        tracksHeader.style.top = `${header.offsetHeight}px`;
    } else {
        tracksHeader.classList.remove("sticky", `top-10`, "bg-black-secondary", "px-8");
        tracksHeader.classList.add("mx-8")

    }
}

const fillContentForPlaylist = (playlistId) => {
    const pageContents = document.querySelector("#page-contents");
    pageContents.innerHTML = `
    <header id="tracks-header" class="mx-8 py-4 border-light-black border-b-4 z-10">
        <nav>
        <ul class="grid grid-cols-[50px_1fr_1fr_50px] items-center gap-4 p-2">
            <li class="justify-self-center">#</li>
            <li class="justify-self-start">Title</li>
            <li class="justify-self-start">Album</li>
            <li class="justify-self-center">⏱</li>
        </ul>
        </nav>
    </header>
    <section class="px-8 mt-4" id="tracks"></section>`;
    document.querySelector(".content").addEventListener('scroll', stickTracksHeaderOnScroll);
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
        playlistTracksection?.removeEventListener('scroll', stickTracksHeaderOnScroll);

        fillContentForDashboard();
        loadPlaylists();
    }
    else if (section.type == SECTIONTYPE.PLAYLIST) {
        fillContentForPlaylist(section.playlist);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // alert();
    loadUserProfile();
    // const section = { type: SECTIONTYPE.DASHBOARD };
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: '37i9dQZF1DX4Cmr6Ex5w24' };
    loadSection(section);
    const prevButton = document.querySelector("#prev");
    const playButton = document.querySelector("#play");
    const nextButton = document.querySelector("#next");
    const progress = document.querySelector("#progress");
    const volumeInput = document.querySelector("#volume");
    const totalDuration = document.querySelector("#total-duration");
    const totalDurationCompleted = document.querySelector("#total-duration-completed");
    const timeline = document.querySelector("#timeline");
    // history.pushState(section, "", "");
    // history.pushState(section, "", `playlist/37i9dQZF1DX4Cmr6Ex5w24`);

    audio.addEventListener("loadedmetadata", onMetadataLoaded);
    // audio.addEventListener("ended", (event) => togglePlayer(event, { id: currentSongId }));
    let interval;
    audio.addEventListener("play", () => {
        interval = setInterval(() => {
            totalDurationCompleted.textContent = formatDuration(audio.currentTime.toFixed(0) * 1000);
            progress.style.width = `${((audio.currentTime / audio.duration) * 100).toFixed(0)}%`;
            // alert(progress.style.width);
        }, 100);
        const trackPlayButton = document.querySelector(`#play-track${currentSongId}`);
        trackPlayButton.querySelector('span').textContent = "pause";
        playButton.querySelector("span").textContent = "pause_circle";
    });
    audio.addEventListener("pause", () => {
        if (interval) {
            clearInterval(interval);
        }
        const trackPlayButton = document.querySelector(`#play-track${currentSongId}`);
        trackPlayButton.querySelector('span').textContent = "play_arrow";
        playButton.querySelector("span").textContent = "play_circle";
    })
    playButton.addEventListener('click', (event) => togglePlayer(event, { id: currentSongId }));
    prevButton.addEventListener('click', playPrevTrack);
    nextButton.addEventListener('click', playNextTrack);


    document.addEventListener('click', () => {
        const menu = document.getElementById("user-profile-menu");
        if (!menu.classList.contains("hidden")) {
            menu.classList.add("hidden");
        }
    });

    timeline.addEventListener('click', (event) => {
        const timelinewidth = window.getComputedStyle(timeline).width;
        const timeToSeek = (event.offsetX / parseInt(timelinewidth)) * audio.duration;
        audio.currentTime = timeToSeek;
        progress.style.width = `${((audio.currentTime / audio.duration) * 100).toFixed(0)}% `;
    }, false);

    volumeInput.addEventListener('change', () => {
        audio.volume = volumeInput.value / 100;
    })

    document.querySelector(".content").addEventListener('scroll', (event) => {
        // alert();
        const header = document.querySelector('.header');
        // alert(JSON.stringify(event));
        // alert(header);
        const { scrollTop } = event.target;
        if (scrollTop >= header.offsetHeight) {
            // alert();
            header.classList.add("sticky", "top-0", "bg-black");
            header.classList.remove("bg-transparent");
        } else {
            header.classList.remove("sticky", "top-0", "bg-black");
            header.classList.add("bg-transparent");
        }
    })

});

window.addEventListener('popstate', (event) => {
    loadSection(event.state);
});