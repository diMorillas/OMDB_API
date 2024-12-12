/**
 * @file fetch.js
 * @description JavaScript file for handling movie search using the OMDB API. 
 * Handles fetching, filtering, and displaying movie data in response to user input.
 * @authors 
 * - Didac Morillas
 * - Pau Morillas
 */

/**
 * Event listener for the search button. Initiates a request to the OMDB API to search for movies
 * based on the user's input and optional year filter. Dynamically updates the results section
 * with movie cards or displays an error message if no results are found.
 */
document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value; // User's search input
    const year = document.getElementById('yearFilter').value; // Year filter, if any
    const resultsContainer = document.getElementById('results'); // Container for displaying results
    resultsContainer.innerHTML = ''; // Clear previous results

    // Validate search input
    if (!query.trim()) { // Eliminates any extra blank spaces
        alert('Please, write a movie.');
        return;
    }

    const apiKey = '46dd0020'; // OMDB API key (replace if needed)
    let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
    if (year) url += `&y=${year}`; // Append year filter if provided

    try {
        // Fetch data from the API
        const response = await fetch(url);

        if (!response.ok) {
            // Handle HTTP errors
            resultsContainer.innerHTML = `<p class="text-danger text-center">An error occurred while fetching data.</p>`;
            return;
        }

        const data = await response.json(); // Parse JSON response

        if (data.Response === 'True') {
            // Populate results with movie cards
            data.Search.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'col-md-4'; // Bootstrap column class
                card.innerHTML = `
                    <div class="card">
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : '../images/no-photo-aviable.jpg'}" class="card-img-top" alt="${movie.Title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.Title}</h5>
                            <p class="card-text">Year: ${movie.Year}</p>
                        </div>
                    </div>`;
                resultsContainer.appendChild(card);
            });
        } else {
            // Display error message if no movies are found
            resultsContainer.innerHTML = `<p class="text-danger text-center">${data.Error}</p>`;
        }
    } catch (error) {
        // Handle network errors or unexpected issues
        resultsContainer.innerHTML = `<p class="text-danger text-center">Network error occurred.</p>`;
    }
});
