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
app.use(express.static('public'));

// WebSocket event handling
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listens for the 'searchMovie' event from the client.
    socket.on('searchMovie', async ({ query, year, type }) => {
        if (!query.trim()) {
            socket.emit('searchResults', { error: 'Please, write a movie.' });
            return;
        }

        let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
        if (year) url += `&y=${year}`;
        if (type) url += `&type=${type}`; // Append type if provided

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

    // Handles client disconnection.
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
