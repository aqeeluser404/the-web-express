const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig')
const { 
    CreateUnitController, 
    FindUnitByIdController, 
    FindAllUnitsController, 
    UpdateUnitController,
    DeleteUnitController
} = require('../src/controllers/unitController');
const { verifyToken, requireAdmin } = require('../middleware/authentication')



// Public routes --------------------------------------------------------

// Get all units
router.get('/units', FindAllUnitsController);

// Get a unit by ID - VIEW MORE
router.get('/units/:id', FindUnitByIdController);



// Protected routes -----------------------------------------------------

// Create a new unit
router.post('/admin/units', upload.array('images', 12), verifyToken, requireAdmin, CreateUnitController);

// Update a unit by ID
router.put('/admin/units/:id', upload.array('images', 12), verifyToken, requireAdmin, UpdateUnitController);

// Delete a unit by ID
router.delete('/admin/units/:id', verifyToken, requireAdmin, DeleteUnitController);

module.exports = router;