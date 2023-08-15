const home = document.querySelector(".homeActive");
const about = document.querySelector(".aboutActive");
const contact = document.querySelector(".contactActive");

const currentLocation = window.location.href;

if(currentLocation == "http://localhost:8800/") {
    home.classList.add("active");
}

if(currentLocation == "http://localhost:8800/about") {
    about.classList.add("active");
}

if(currentLocation == "http://localhost:8800/contact") {
    contact.classList.add("active");
}

