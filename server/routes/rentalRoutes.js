const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authentication');
const {
    CreateRentalController,
    FindRentalByIdController,
    FindAllRentalsController,
    FindAllMyRentalsController,
    UpdateRentalStatusController,
    EndRentalController,
    DeleteRentalController
} = require('../src/controllers/rentalController')



// Public routes --------------------------------------------------------

// Create a new rental
router.post('/rentals', verifyToken, CreateRentalController);

// Get a rental by ID
router.get('/rentals/:id', verifyToken, FindRentalByIdController);

// Get all rentals for a specific user
router.get('/users/:id/rentals', verifyToken, FindAllMyRentalsController);



// Protected routes ------------------------------------------------------

// Get all rentals
router.get('/rentals', verifyToken, requireAdmin, FindAllRentalsController);

// Update rental status
router.put('/rentals/:id', verifyToken, requireAdmin, UpdateRentalStatusController);

// End a rental - only use after unit has been rented
router.put('/rentals/:id/end', verifyToken, requireAdmin, EndRentalController);

// Delete a rental
router.delete('/rentals/:id', verifyToken, requireAdmin, DeleteRentalController);

module.exports = router;