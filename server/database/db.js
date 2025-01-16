const mongoose = require('mongoose')

exports.connect = function() {
    mongoose.connect(process.env.MONGODB_URL)
    const db = mongoose.connection;
    db.on('error', (error) => {
        console.error('Error Connecting to DB:', error)
    })
    db.once('open', () => {
        console.log('Successfully Connected to DB')
    })
}