const API_KEY = "add your api key";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const POPULAR = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
const SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

let favorites = JSON.parse(localStorage.getItem("myFavs")) || [];

getMovies(POPULAR);

async function getMovies(url) {
    document.getElementById("loader").style.display = "block";
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("loader").style.display = "none";
    showMovies(data.results);
}

function showMovies(movies) {
    const moviesDiv = document.getElementById("movies");
    moviesDiv.innerHTML = "";

    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        if(!poster_path) return;

        const isFav = favorites.includes(id);
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <div class="badge">⭐ ${vote_average.toFixed(1)}</div>
            <div class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${id})">❤</div>
            <img src="${IMG_PATH + poster_path}" onclick="openModal('${title}', '${overview.replace(/'/g, "\\'")}')">
            <div class="info"><h3>${title}</h3></div>
        `;
        moviesDiv.appendChild(movieEl);
    });
}

function toggleFav(e, id) {
    e.stopPropagation();
    if(favorites.includes(id)) {
        favorites = favorites.filter(fid => fid !== id);
        e.target.classList.remove("active");
    } else {
        favorites.push(id);
        e.target.classList.add("active");
    }
    localStorage.setItem("myFavs", JSON.stringify(favorites));
}

function searchMovie() {
    const val = document.getElementById("searchInput").value;
    val ? getMovies(SEARCH + val) : getMovies(POPULAR);
}

function openModal(title, text) {
    document.getElementById("modalDetails").innerHTML = `<h2 style="color:#e50914">${title}</h2><p>${text}</p>`;
    document.getElementById("movieModal").style.display = "flex";
}

function closeModal() { document.getElementById("movieModal").style.display = "none"; }
function closeModalOutside(e) { if(e.target.id === "movieModal") closeModal(); }