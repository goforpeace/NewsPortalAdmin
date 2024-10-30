const express = require('express')
const app = express()
const dotenv = require('dotenv')
const body_parser = require('body-parser')
const cors = require('cors')
const db_connect = require('./utils/db')
const advertisementRoutes = require('./routes/advertisement');

dotenv.config()


app.use(body_parser.json())

if (process.env.mode === 'production') {
    app.use(cors({
        origin: ["https://news-portal-admin.vercel.app"]
    }));
} else {
    app.use(cors({
        origin: ["http://localhost:5173"]
    }));
}


app.use('/api/advertisement', advertisementRoutes);


app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/newsRoute'))
app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.port

db_connect()

app.listen(port, () => console.log(`server is running on port ${port}!`))
