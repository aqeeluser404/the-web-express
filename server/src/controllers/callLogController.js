const CallLogService = require('../services/callLogService');

module.exports.CreateCallLogController = async (req, res) => {
    try {
        const callLog = await CallLogService.createCallLogService(req.body);
        res.status(201).json({ message: 'Call log created successfully', callLog });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create call log', error: error.toString() });
    }
}

module.exports.FindCallLogByIdController = async (req, res) => {
    try {
        const callLog = await CallLogService.findCallLogByIdService(req.body);
        res.status(200).json(callLog)
    } catch (error) {
        res.status(404).json({ message: 'Failed to find call log', error: error.toString() });
    }
}

module.exports.FindAllMyCallLogsController = async (req, res) => {
    try {
        const { id } = req.params;
        const callLogs = await CallLogService.findAllMyCallLogsService(id);
        res.status(200).json(callLogs);
    } catch (error) {
        res.status(404).json({ message: 'Failed to find user call logs', error: error.toString() });
    }
};

module.exports.FindAllCallLogsController = async (req, res) => {
    try {
        const callLogs = await CallLogService.findAllCallLogsService();
        res.status(200).json(callLogs);
    } catch (error) {
        res.status(404).json({ message: 'Failed to find call logs', error: error.toString() });
    }
};

module.exports.UpdateCallLogStatusService = async (req, res) => {
    try {
        const { id } = req.params;
        const callLogDetails = req.body;
        const updatedCallLog = await CallLogService.updateCallLogService(id, callLogDetails);
        res.status(200).json(updatedCallLog);
    } catch (error) {
        res.status(404).json({ message: 'Failed to update call log', error: error.toString() });
    }
};

module.exports.DeleteCallLogController = async (req, res) => {
    try {
        const { id } = req.params;
        await CallLogService.deleteCallLogService(id);
        res.status(200).json({ message: 'Call log deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete call log', error: error.toString() });
    }
};
