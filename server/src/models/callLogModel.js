const mongoose = require('mongoose')
var Schema = mongoose.Schema

const callLogSchema = new mongoose.Schema(
    {
        callType: {
            type: String,
            required: true
        },
        status: { 
            type: String, 
            enum: ['Pending', 'In Progress', 'Resolved'],
            default: 'Pending' 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
)

module.exports = mongoose.model('CallLog', callLogSchema);