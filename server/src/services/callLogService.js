const User = require('../models/userModel');
const CallLog = require('../models/callLogModel');

module.exports.createCallLogService = async (callLogDetails) => {
    try {
        const existingLog = await CallLog.findOne({ _id: callLogDetails._id });
        if (existingLog) {
            throw new Error('Call log with this ID already exists');
        }
        const callLogModelData = new CallLog({
            callType: callLogDetails.callType,
            // description: callLogDetails.description,
            status: 'Pending',
            createdAt: new Date(),
            user: callLogDetails.user,
        });
        await callLogModelData.save();

        // Update user with call log
        await User.findOneAndUpdate(
            { _id: callLogDetails.user }, 
            { $push: { callLogs: callLogModelData._id } }, 
            { new: true }
        );

        return callLogModelData;
    } catch (error) {
        console.error('Error creating call log:', error);
        throw error;
    }
};

// Get call log by ID
module.exports.findCallLogByIdService = async (id) => {
    try {
        const callLog = await CallLog.findById(id);
        if (!callLog) {
            throw new Error('Call log not found');
        }
        return callLog;
    } catch (error) {
        console.error('Error finding call log by ID:', error);
        throw error;
    }
};

// Get all user call logs
module.exports.findAllMyCallLogsService = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const callLogs = await CallLog.find({ _id: { $in: user.callLogs } });
        return callLogs;
    } catch (error) {
        console.error('Error finding all user call logs:', error);
        throw error;
    }
};

// Get all call logs
module.exports.findAllCallLogsService = async () => {
    try {
        const callLogs = await CallLog.find();
        return callLogs;
    } catch (error) {
        console.error('Error finding all call logs:', error);
        throw error;
    }
};

// Update call log (status)
module.exports.updateCallLogService = async (callLogId, callLogDetails) => {
    try {
        const callLogToUpdate = await CallLog.findByIdAndUpdate(callLogId, callLogDetails, { new: true });
        if (!callLogToUpdate) {
            throw new Error('Call log not found');
        }
        return callLogToUpdate;
    } catch (error) {
        console.error('Error updating call log:', error);
        throw error;
    }
};

// Delete call log
module.exports.deleteCallLogService = async (callLogId) => {
    try {
        const callLog = await CallLog.findById(callLogId);
        if (!callLog) {
            throw new Error('Call log not found');
        }
        // Remove call log from user's callLogs
        await User.findByIdAndUpdate(
            callLog.user,
            { $pull: { callLogs: callLog._id } },
            { new: true }
        );
        await CallLog.findByIdAndDelete(callLogId);

        return true;
    } catch (error) {
        console.error('Error deleting call log:', error);
        throw error;
    }
};