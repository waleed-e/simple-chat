const express = require('express');
const { join } = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000; // Use environment variable or default to 5000
const io = new Server(server);

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for incoming messages from the client
    socket.on('message', (msg) => {
        console.log('Message received: ' + msg);

        // Emit the message to all connected clients
        io.emit('send_message_to_all', msg);  // Send to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
});
