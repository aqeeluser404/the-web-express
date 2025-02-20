const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const unitSchema = new mongoose.Schema(
    {
        unitNumber: {
            type: Number,
            required: true
        },
        floorLevel: {
            type: String,
            required: true,
            enum: ['Ground Floor', 'First Floor', 'Second Floor']
        },
        unitType: {
            type: String,
            required: true
        },
        unitOccupants: {
            type: Number,
            required: true
        },
        currentOccupants: {
            type: Number,
            default: 0
        },
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
            default: 'Available'
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
        }],
        genderAssignment: {
            type: String,
            enum: ['Male', 'Female'],
        }
    }, { collection: 'Unit' }
);

// Pre-save hook to update unitStatus
unitSchema.pre('save', function(next) {
    this.unitStatus = this.currentOccupants >= this.unitOccupants ? 'Occupied' : 'Available';
    next();
    if (this.currentOccupants === 0) {
        this.genderAssignment = undefined;
    }
    next();
});

// Middleware to enforce gender restriction
unitSchema.pre('validate', function(next) {
    if (this.isNew && this.genderAssignment) {
        this.constructor.findOne({ unitNumber: this.unitNumber }, (err, unit) => {
            if (err) return next(err);
            if (unit && unit.genderAssignment !== this.genderAssignment) {
                return next(new Error('Gender restriction: This unit is only available for ' + unit.genderAssignment + 's.'));
            }
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('Unit', unitSchema);