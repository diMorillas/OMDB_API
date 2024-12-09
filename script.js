document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("input[placeholder='Busca tu película favorita...']");
    const genreSelect = document.querySelector("select[aria-label='Genre']");
    const yearSelect = document.querySelector("select[aria-label='Year']");
    const movieCardsContainer = document.querySelector("#movie-cards .row");
    const searchButton = document.getElementById("search-button");
  
    // Función para buscar películas
    function searchMovies() {
      const query = searchInput.value.trim();
      const year = yearSelect.value;
  
      // Construir URL de la API con parámetros
      let url = `http://www.omdbapi.com/?apikey=46dd0020&s=${query}`;
      if (year !== "Año") {
        url += `&y=${year}`;
      }
  
      // Usar XHR para hacer la solicitud
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.Response === "True") {
            fetchMovieDetails(response.Search);
          } else {
            movieCardsContainer.innerHTML = `<p class="text-center text-light">No se encontraron resultados.</p>`;
          }
        } else {
          console.error("Error al realizar la solicitud:", xhr.status);
        }
      };
      xhr.send();
    }
  
    // Función para obtener detalles de cada película
    function fetchMovieDetails(movies) {
      movieCardsContainer.innerHTML = ""; // Limpiar contenido anterior
      let fragment = document.createDocumentFragment();
  
      const selectedGenre = genreSelect.value.toLowerCase();
      let processedMovies = 0; // Contador de películas procesadas
  
      movies.forEach(movie => {
        const url = `http://www.omdbapi.com/?apikey=46dd0020&i=${movie.imdbID}`;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
          if (xhr.status === 200) {
            const details = JSON.parse(xhr.responseText);
            const movieGenre = details.Genre.toLowerCase();
  
            // Filtrar por género si está seleccionado
            if (selectedGenre === "género" || movieGenre.includes(selectedGenre)) {
              const col = document.createElement("div");
              col.className = "col";
              col.innerHTML = `
                <div class="card text-center">
                  <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/150"}" 
                       class="card-img-top" 
                       alt="${details.Title}">
                  <div class="card-body">
                    <h5 class="card-title">${details.Title}</h5>
                    <p class="card-text">
                      <span>Género: ${details.Genre}</span><br>
                      <span>Año: ${details.Year}</span>
                    </p>
                  </div>
                </div>
              `;
              fragment.appendChild(col);
            }
          }
          processedMovies++;
          // Cuando se procesan todas las películas, agregamos el fragmento
          if (processedMovies === movies.length) {
            if (!fragment.children.length) {
              movieCardsContainer.innerHTML = `<p class="text-center text-light">No se encontraron resultados con el género seleccionado.</p>`;
            } else {
              movieCardsContainer.appendChild(fragment);
            }
          }
        };
        xhr.send();
      });
    }
  
    // Escuchar eventos de búsqueda
    searchButton.addEventListener("click", searchMovies);
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchMovies();
      }
    });
  });
  