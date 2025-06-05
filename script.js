const API_KEY = '7e400332'; // SAM API KEY

async function searchMovie() {
  const title = document.getElementById('movieInput').value;
  if (!title) return;

  const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
  const data = await response.json();

  const detailsDiv = document.getElementById('movieDetails');
  const recDiv = document.getElementById('recommendations');
  detailsDiv.innerHTML = '';
  recDiv.innerHTML = '';

  if (data.Response === "True") {
    detailsDiv.innerHTML = `
      <h2>${data.Title} (${data.Year})</h2>
      <img src="${data.Poster !== "N/A" ? data.Poster : ""}" alt="Poster">
      <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
      <p>${data.Plot}</p>
      <p><a href="https://www.imdb.com/title/${data.imdbID}/" target="_blank">View on IMDb</a></p>
    `;

    showRecommendations(data.Title.split(" ")[0]);
  } else {
    detailsDiv.innerHTML = `<p>Movie not found!</p>`;
  }
}

async function showRecommendations(keyword) {
  const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(keyword)}&apikey=${API_KEY}`);
  const data = await response.json();

  const recDiv = document.getElementById('recommendations');

  if (data.Response === "True") {
    recDiv.innerHTML = `<h3>Recommended Movies</h3>`;
    for (let i = 1; i < Math.min(data.Search.length, 5); i++) {
      const movie = data.Search[i];
      const movieDetails = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
      const fullDetails = await movieDetails.json();

      recDiv.innerHTML += `
        <div class="movie-card">
          <h4>${fullDetails.Title} (${fullDetails.Year})</h4>
          <img src="${fullDetails.Poster !== "N/A" ? fullDetails.Poster : ""}" alt="Poster" width="100">
          <p><strong>IMDb Rating:</strong> ${fullDetails.imdbRating}</p>
          <p><a href="https://www.imdb.com/title/${fullDetails.imdbID}/" target="_blank">View on IMDb</a></p>
        </div>
      `;
    }
  } else {
    recDiv.innerHTML = `<p>No recommendations found.</p>`;
  }
}

async function searchByGenre(genre) {
  const detailsDiv = document.getElementById('movieDetails');
  const recDiv = document.getElementById('recommendations');
  detailsDiv.innerHTML = '';
  recDiv.innerHTML = `<h3>${genre} Movies</h3>`;

  const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(genre)}&apikey=${API_KEY}`);
  const data = await response.json();

  if (data.Response === "True") {
    for (let movie of data.Search.slice(0, 5)) {
      const movieDetails = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
      const fullDetails = await movieDetails.json();

      recDiv.innerHTML += `
        <div class="movie-card">
          <h4>${fullDetails.Title} (${fullDetails.Year})</h4>
          <img src="${fullDetails.Poster !== "N/A" ? fullDetails.Poster : ""}" alt="Poster" width="100">
          <p><strong>IMDb Rating:</strong> ${fullDetails.imdbRating}</p>
          <p><a href="https://www.imdb.com/title/${fullDetails.imdbID}/" target="_blank">View on IMDb</a></p>
        </div>
      `;
    }
  } else {
    recDiv.innerHTML += `<p>No movies found for ${genre}.</p>`;
  }
}

