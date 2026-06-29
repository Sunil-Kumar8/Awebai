const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Set up CORS
// Supports comma-separated origin values in FRONTEND_URL env, defaults to allowing all origins (*) in dev
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:8080', 'http://127.0.0.1:8080'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // If allowedOrigins includes '*' or includes the request origin, allow it
        if (allowedOrigins.indexOf('*') !== -1 || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS CORS restriction'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parser middleware (supports URL-encoded and JSON body formats)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Healthcheck Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AwebAI Backend API is active and online!'
    });
});

// Register API Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/quote', require('./routes/quote'));

// 404 Route handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Requested endpoint not found'
    });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`💥 Server Error: ${err.message}`);

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages
        });
    }

    // Handle Mongoose Duplicate Key Error (e.g. email index conflicts)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate key entry error. Value already exists.'
        });
    }

    // Handle Mongoose Cast Error (invalid ObjectId query)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid resource ID parameter'
        });
    }

    // General internal server error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 AwebAI Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
