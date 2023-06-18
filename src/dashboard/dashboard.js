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

const loadFeaturedPlaylist=async ()=>{
    const featuredPlaylist= await fetchData(ENDPOINTS.featuredPlaylist);
    console.log(featuredPlaylist);
    alert(featuredPlaylist);
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