const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authentication');
const {
    CreateRentalController,
    FindRentalByIdController,
    FindAllRentalsController,
    FindAllMyRentalsController,
    UpdateRentalStatusController,
    verifyAndSavePayerController,
    EarlyEndRentalController,
    DeleteRentalController
} = require('../src/controllers/rentalController')



// Public routes --------------------------------------------------------

// Create a new rental
router.post('/rentals', verifyToken, CreateRentalController);

// Get a rental by ID
router.get('/rentals/:id', verifyToken, FindRentalByIdController);

// Get all rentals for a specific user
router.get('/users/:id/rentals', verifyToken, FindAllMyRentalsController);


// Delete a rental
router.delete('/rentals/:id', verifyToken, DeleteRentalController);

// Protected routes ------------------------------------------------------

// Get all rentals
router.get('/admin/rentals', verifyToken, FindAllRentalsController);

// Update rental status
router.put('/admin/rentals/:id', verifyToken, requireAdmin, UpdateRentalStatusController);

router.put('/rentals/:id/payer', verifyToken, verifyAndSavePayerController)

// End a rental - only use after unit has been rented
router.put('/admin/rentals/:id/end', verifyToken, requireAdmin, EarlyEndRentalController);



module.exports = router;
