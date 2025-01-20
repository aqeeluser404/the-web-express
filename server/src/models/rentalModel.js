const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const rentalSchema = new mongoose.Schema(
    {
        applicationDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: 'Pending'
        },
        rentalStartDate: {
            type: Date,
            default: null 
        },
        rentalEndDate: {
            type: Date,
            default: null 
        },
        rentalPrice: {
            type: Number,
            required: true
        },

        // FK FIELDS
        unit: {
            type: Schema.Types.ObjectId,
            ref: 'Unit',
            required: true
        },
        unitType: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    }, { collection: 'Rental' }
)
module.exports = mongoose.model('Rental', rentalSchema)