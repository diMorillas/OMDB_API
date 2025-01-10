/**
 * @file server.js
 * @description Node.js server using Express, Socket.IO, and Axios to perform REST calls to the OMDB API.
 * The server exposes a WebSocket service for clients to query information retrieved from the API.
 * @authors
 * - Didac Morillas
 * - Pau Morillas
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const API_KEY = '46dd0020'; // OMDB API key

// Serve static files from the "public" folder
/**
 * Serves static files for the client.
 * @middleware
 */
app.use(express.static('public'));

// WebSocket event handling
/**
 * Handles WebSocket connections and defines related events.
 * @event io#connection
 * @param {Socket} socket - Represents the connected client socket.
 */
io.on('connection', (socket) => {
    console.log('Client connected');

    /**
     * Listens for the 'searchMovie' event from the client.
     * Makes a REST call to the OMDB API based on the query and optional year.
     * Emits the search results or an error back to the client.
     * @event socket#searchMovie
     * @param {Object} data - Data sent by the client.
     * @param {string} data.query - The movie title to search for.
     * @param {string} [data.year] - Optional year filter for the search.
     */
    socket.on('searchMovie', async ({ query, year }) => {
        if (!query.trim()) {
            socket.emit('searchResults', { error: 'Please, write a movie.' });
            return;
        }

        let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
        if (year) url += `&y=${year}`;
        if (document.getElementById("typeFilter").value != "") url+= `&type=${document.getElementById("typeFilter").value}`; //Append type if provided


        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.Response === 'True') {
                socket.emit('searchResults', data.Search);
            } else {
                socket.emit('searchResults', { error: data.Error });
            }
        } catch (error) {
            console.error(error);
            socket.emit('searchResults', { error: 'An error occurred while fetching data.' });
        }
    });

    /**
     * Handles client disconnection.
     * @event socket#disconnect
     */
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
/**
 * Starts the server on a specified port.
 * Defaults to port 3000 if no environment variable is set.
 */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
