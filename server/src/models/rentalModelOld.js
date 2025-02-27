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
            default: 'Pending',
            enum: ['Pending', 'Rejected', 'Active', 'Ended'],
        },
        rentalStartDate: {
            type: Date,
            default: null 
        },
        rentalEndDate: {
            type: Date,
            default: null 
        },
        earlyEndDate: {
            type: Date,
            default: null ,
            required: false
        },
        rentalPrice: {
            type: Number,
            required: true
        },

        // PAYER INFORMATION
        // payerInfo: {
        //     firstName: {
        //         type: String,
        //         required: true,
        //     },
        //     lastName: {
        //         type: String,
        //         required: true,
        //     },
        //     age: {
        //         type: String,
        //         required: true,
        //     },
        //     contactInfo: {
        //         email: {
        //             type: String,
        //             required: true,
        //         },
        //         phone: {
        //             type: String,
        //             required: true,
        //         },
        //     },
        //     idNumber: {
        //         type: String,
        //         required: true,
        //     },
        //     // DOCUMENTS
        //     idDocument: {
        //         documentUrl: { type: String, required: false },
        //         fileId: { type: String, required: false },
        //         uploadDate: { type: Date, default: Date.now }
        //     },
        //     isVerified: {
        //         type: Boolean,
        //         default: false,
        //     },
        // },

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