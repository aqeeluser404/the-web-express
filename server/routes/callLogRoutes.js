const express = require('express')
const router = express.Router()
const { verifyToken, requireAdmin } = require('../middleware/authentication')
const {
    CreateCallLogController,
    FindCallLogByIdController,
    FindAllMyCallLogsController,
    FindAllCallLogsController,
    UpdateCallLogStatusService,
    DeleteCallLogController
} = require('../src/controllers/callLogController')

router.post('/call-log', verifyToken, CreateCallLogController)

router.get('/call-log/:id', verifyToken, FindCallLogByIdController)

router.get('/users/:id/call-logs', verifyToken, FindAllMyCallLogsController)

router.get('/admin/call-logs', verifyToken, requireAdmin, FindAllCallLogsController)

router.put('/admin/call-log/:id', verifyToken, requireAdmin, UpdateCallLogStatusService)

router.delete('/call-log/:id', verifyToken, DeleteCallLogController)

module.exports = router