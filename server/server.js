const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const db_connect = require('./utils/db');
const advertisementRoutes = require('./routes/advertisement');
const authRoutes = require('./routes/authRoutes');
const newsRoute = require('./routes/newsRoute');

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

// CORS configuration
const allowedOrigins = [
    "https://news-portal-admin.vercel.app",
    "https://news-portal-admin-hjo9.vercel.app"
];

if (process.env.mode === 'production') {
    // In production mode, allow only specific origins
    app.use(cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        optionsSuccessStatus: 200 // For legacy browsers that choke on 204
    }));
} else {
    // In development mode, allow localhost for testing
    app.use(cors({
        origin: ["http://localhost:5173"],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200
    }));
}

// Logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/advertisement', advertisementRoutes);
app.use('/api/auth', authRoutes); // Explicitly define the API prefix
app.use('/api/news', newsRoute); // Explicitly define the API prefix

// Basic root route
app.get('/', (req, res) => res.send('Hello World!'));

// Database connection
db_connect();

// Start server
const port = process.env.PORT || 5000; // Fallback to port 5000 if PORT is not defined
app.listen(port, () => console.log(`Server is running on port ${port}!`));




// const express = require('express')
// const app = express()
// const dotenv = require('dotenv')
// const body_parser = require('body-parser')
// const cors = require('cors')
// const db_connect = require('./utils/db')
// const advertisementRoutes = require('./routes/advertisement');

// dotenv.config()


// app.use(body_parser.json())

// if (process.env.mode === 'production') {
//     app.use(cors({
//     origin: ["https://news-portal-admin.vercel.app", "https://news-portal-admin-hjo9.vercel.app"],
//     credentials: true // Allow credentials
//     }));
// } else {
//     app.use(cors({
//         origin: ["http://localhost:5173"]
//     }));
// }


// app.use('/api/advertisement', advertisementRoutes);


// app.use('/', require('./routes/authRoutes'))
// app.use('/', require('./routes/newsRoute'))
// app.get('/', (req, res) => res.send('Hello World!'))

// const port = process.env.port

// db_connect()

// app.listen(port, () => console.log(`server is running on port ${port}!`))
