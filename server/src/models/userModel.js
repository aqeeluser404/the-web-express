const mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },   
        phone: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            enum: ['admin', 'user'],
            required: true
        },
        dateCreated: {
            type: Date,
            default: Date.now
        },

        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: false
        },

        studentInfo: {
            isRegisteredStudent: {
                type: Boolean,
                default: false
            },
            studentNumber: String,
            registeredInstitution: String,
            hasBursary: {
                type: Boolean,
                default: false
            },
        },
        
        verification: {
            isVerified: {
                type: Boolean,
                default: false
            },
            verificationToken: String,
            verificationTokenExpires: Date
        },

        forgotPassword: {
            resetPasswordToken: String,
            resetPasswordExpires: Date
        },

        // LOGIN DATA & HISTORY
        loginInfo: {
            lastLogin: {
                type: Date,
                default: null
            },
            isLoggedIn: {
                type: Boolean,
                default: false
            },
            loginCount: {
                type: Number,
                default: 0
            },
            loginToken: String
        },

        // FK FIELDS
        rentals: [{
            type: Schema.Types.ObjectId,
            ref: 'Rental'
        }],

        // FK FIELDS
        callLogs: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        // DOCUMENTS
        documents: [{
            documentUrl: { type: String, required: false },
            fileId: { type: String, required: false },
            uploadDate: { type: Date, default: Date.now }
        }]

    }, { collection: 'User' }
)

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

userSchema.methods.updateLoginStatus = function(token) {
    this.loginInfo.lastLogin = Date.now()
    this.loginInfo.isLoggedIn = true
    this.loginInfo.loginCount += 1

    if (this.loginInfo.loginToken !== token) {
        this.loginInfo.loginToken = token
    }

    // this.loginInfo.loginToken = token
    return this.save()
}

userSchema.methods.logout = function() {
    this.loginInfo.isLoggedIn = false;
    this.loginInfo.loginToken = null;
    this.save();
}

module.exports = mongoose.model('User', userSchema)