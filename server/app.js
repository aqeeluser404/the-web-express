require('dotenv').config()
const express = require('express')
const app = express()
const compression = require('compression')
const db = require('./database/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const { checkTokens } = require('./middleware/authentication');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');

app.use(morgan('dev'))
app.use(compression())
app.use(cookieParser())
app.use(express.json())

const allowedOrigins = [
    process.env.HOST_LINK_1,
    process.env.HOST_LINK_2,
    process.env.HOST_LINK_3,
    "https://the-web-mobile-app.onrender.com"
]
// cors config
const corsOptions = {
    origin: function (origin, callback) {
        // console.log('Origin:', origin); // Log the origin for debugging
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

cron.schedule('*/10 * * * *', () => {
    console.log('Running token check every ten minutes');
    checkTokens()
})
// cron.schedule('*/1 * * * *', () => {
//     console.log('Running token check every minute');
//     checkTokens();
// })
// routes --------------------------------------------------------------------------------------
app.get('/', (req, res) => {
    res.send('Backend is running');
})

// app.get('/payment-success', (req, res) => {
//     res.send('Payment was successful!')
// })
// app.get('/payment-cancel', (req, res) => {
//     res.send('Payment was canceled.')
// })
// app.get('/payment-failure', (req, res) => {
//     res.send('Payment failed. Please try again.')
// })

// Route to check if server is up
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' })
})

// Route to check if token exists
app.get('/check-token', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.status(200).json({ exists: true });
    } else {
        res.status(200).json({ exists: false });
    }
})

// Route to retrieve token if token exists
app.get('/get-token', (req, res) => {
    const token = req.cookies.token
  
    if (!token) {
      return res.status(401).json({ message: 'No token found in cookie' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json(token);
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
})

// Route to remove the token (clear cookie)
app.post('/remove-token', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', { httpOnly: true, secure: isProduction, sameSite: 'None', path: '/' });
    res.send({ message: 'Token removed' });
})

// application routes
const routes = [
    require('./routes/userRoutes'),
    require('./routes/emailRoutes'),
    require('./routes/unitRoutes'),
    require('./routes/rentalRoutes')
]
routes.forEach(route => {
    app.use(route)
})

// Backend start -------------------------------------------------------------------------------
app.listen(process.env.PORT, function check(error) {
    if (error) {
        console.log("An error has occurred");
    } else {
        console.log("Started server");
    }
})
// Connect to the database
db.connect()

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})
