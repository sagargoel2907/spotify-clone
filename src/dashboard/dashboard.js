import { fetchData } from "../api";
import { ENDPOINTS } from "../common";

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("default-image");
    const userProfileBtn = document.querySelector("user-profile-btn");
    const displayName = document.querySelector("display-name");

    const userProfile = await fetchData(ENDPOINTS.userProfile);
    console.log(userProfile);
    alert(userProfile);
};

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
});