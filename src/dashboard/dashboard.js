import { fetchData } from "../api";
import { ENDPOINTS } from "../common";

const onProfileClick = (event) => {
    event.stopPropagation();
    const menu = document.getElementById("user-profile-menu");
    menu.classList.toggle("hidden");
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

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
});

document.addEventListener('click',()=>{
    const menu = document.getElementById("user-profile-menu");
    if(!menu.classList.contains("hidden")){
        menu.classList.add("hidden");
    }
})