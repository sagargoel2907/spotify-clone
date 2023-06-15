import { fetchData } from "../api";
import { ENDPOINTS } from "../common";

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("#default-image");
    const userProfileBtn = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name");

    const userProfile = await fetchData(ENDPOINTS.userProfile);
    const { display_name: displayName, images } = userProfile;
    displayNameElement.textContent = displayName;

    if(images.length){
        defaultImage.classList.add("hidden");
    }else{
        defaultImage.classList.remove("hidden");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
});