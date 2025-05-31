require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require("morgan")
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Create Express app
const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
    origin: true, // Reflect the request origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
};

// Detailed request logging middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const method = req.method;
    const url = req.originalUrl;
    
    console.log('\n=== Incoming Request ===');
    console.log(`${method} ${url} from ${origin || 'unknown origin'}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Query:', req.query);
    
    // Log request body for non-GET requests
    if (method !== 'GET' && method !== 'HEAD') {
        console.log('Body:', req.body);
    }
    
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    
    // Handle preflight requests
    if (method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        return res.status(200).end();
    }
    
    // Add response logging
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        console.log('\n=== Response ===');
        console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
        console.log('Headers:', JSON.stringify(res.getHeaders(), null, 2));
        if (chunk) {
            try {
                const body = JSON.parse(chunk.toString());
                console.log('Body:', body);
            } catch (e) {
                console.log('Body:', chunk?.toString()?.substring(0, 200) + '...');
            }
        }
        originalEnd.call(res, chunk, encoding);
    };
    
    next();
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            console.log('Socket.IO connection from origin:', origin);
            callback(null, true); // Allow all origins
        },
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Temporary logging middleware
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('SkillSwap API is running...');
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a room (for private chats)
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle chat messages
    socket.on('send_message', (data) => {
        io.to(data.roomId).emit('receive_message', data);
    });

    // Handle session status updates
    socket.on('update_session_status', (data) => {
        io.to(data.roomId).emit('session_status_updated', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap')
    .then(() => {
        console.log('Connected to MongoDB');
        // Start server
        const PORT = process.env.PORT || 5004;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

// Create necessary directories if they don't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Error handler middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});