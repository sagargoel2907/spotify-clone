document.addEventListener('DOMContentLoaded', () => {
    console.log('running');
    if (localStorage.getItem('accessToken')) {
        window.location.href = 'dashboard/dashboard.html';
    }
    else {
        window.location.href = 'login/login.html';
    }
});
