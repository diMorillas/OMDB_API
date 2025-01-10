/**
 * @file client.js
 * @description JavaScript client for communicating with a Node.js server using WebSockets (Socket.IO).
 * Handles sending movie search requests and displaying the results dynamically on the webpage.
 * @authors
 * - Didac Morillas
 * - Pau Morillas
 */

const socket = io();

/**
 * Event listener for the search button.
 * Sends a search request to the server with the movie query and optional year filter.
 * @event DOM#click
 */
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value; // User's search input
    const year = document.getElementById('yearFilter').value; // Year filter, if provided

    // Emit the 'searchMovie' event to the server
    socket.emit('searchMovie', { query, year });
});

/**
 * Event listener for the 'searchResults' event received from the server.
 * Dynamically updates the results section with movie cards or an error message.
 * @event socket#searchResults
 * @param {Array|Object} movies - Array of movie objects or an error message.
 */
socket.on('searchResults', (movies) => {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Handle error messages
    if (movies.error) {
        resultsContainer.innerHTML = `<p class="text-danger text-center">${movies.error}</p>`;
        return;
    }

    // Populate results with movie cards
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'col-md-4'; // Bootstrap column class
        card.innerHTML = `
            <div class="card">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : '../images/no-photo-aviable.jpg'}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">Year: ${movie.Year}</p>
                    <p class="card-text">Year: ${movie.Type}</p>
                </div>
            </div>`;
        resultsContainer.appendChild(card);
    });
});

/**
 * Event listener for generic 'error' events received from the server.
 * Displays an error message in the results section.
 * @event socket#error
 * @param {string} message - Error message to be displayed.
 */
socket.on('error', (message) => {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<p class="text-danger text-center">${message}</p>`;
});
