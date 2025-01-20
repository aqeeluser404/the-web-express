const mongoose = require('mongoose');
var Schema = mongoose.Schema
const unitSchema = new mongoose.Schema(
    {
        unitType: {
            type: String,
            required: true
        },
        // unitNumber: {
        //     type: String,
        //     required: true
        // },
        bedrooms: {
            type: Number,
            required: true
        },
        kitchens: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        parking: {
            type: Number,
            required: true
        },
        lounges: {
            type: Number,
            required: true
        },
        // unitDetails: {
        //     bedrooms: {
        //         type: Number,
        //         required: true
        //     },
        //     kitchens: {
        //         type: Number,
        //         required: true
        //     },
        //     bathrooms: {
        //         type: Number,
        //         required: true
        //     },
        //     parking: {
        //         type: Number,
        //         required: true
        //     },
        //     lounges: {
        //         type: Number,
        //         required: true
        //     }
        // },
        unitDescription: {
            type: String,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        unitStatus: {
            type: String,
            enum: ['Available', 'Occupied'],
            required: true
        },
        images: [{
            imageUrl: { type: String, required: false },
            fileId: { type: String, required: false }
        }],
        dateCreated: {
            type: Date,
            default: Date.now
        },
        rentedHistory: [{
            type: Schema.Types.ObjectId,
            ref: 'Rental'
        }]
    }, { collection: 'Unit' }
);

module.exports = mongoose.model('Unit', unitSchema);