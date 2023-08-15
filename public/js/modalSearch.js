const btnSearch = document.querySelector(".header_button");
const searchBar = document.querySelector(".searchBar");

btnSearch.addEventListener("click", () => {
    searchBar.classList.toggle("showSearchBar");
})