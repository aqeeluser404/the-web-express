const express = require('express');
const router = express.Router();
const {
    FindUserByTokenController,
    FindUserByIdController,
    UpdateUserController,
    UserLoginController,
    UserRegisterController,
    UserLogoutController,
    CreateUserController,
    FindAllUsersController,
    FindUsersLoggedInController,
    FindUsersFrequentlyLoggedInController,
    DeleteUserController,
    UploadUserDocsController, 
    ClearAllUserDocsController, 
    RemoveUserDocController
} = require('../src/controllers/userController');
const { verifyToken, requireAdmin } = require('../middleware/authentication');
const upload = require('../middleware/multerConfig')


// User profile routes -----------------------------------------------

// Get user by token
router.get('/users/profile', verifyToken, FindUserByTokenController); 

// Get user by ID
router.get('/users/:id', verifyToken, FindUserByIdController); 

// Update user by identifier (id)
router.put('/users/:id', verifyToken, UpdateUserController); 



// Authentication routes --------------------------------------------

// User login
router.post('/auth/login', UserLoginController); 

// User registration
router.post('/auth/register', UserRegisterController); 

// User logout
router.post('/auth/logout/:id', UserLogoutController); 




router.post('/users/:id/documents', upload.array('documents'), verifyToken, UploadUserDocsController)
router.delete('/users/:id/documents', verifyToken, ClearAllUserDocsController)
router.delete('/users/:id/documents/:doc', verifyToken, RemoveUserDocController)



// Protected routes -----------------------------------------------------

// Create a new user
router.post('/admin/users', verifyToken, requireAdmin, CreateUserController); 

// Get all users
router.get('/admin/users', verifyToken, requireAdmin, FindAllUsersController); 

// Get logged-in users
router.get('/admin/users/logged-in', verifyToken, requireAdmin, FindUsersLoggedInController); 

// Get frequent users
router.get('/admin/users/frequent', verifyToken, requireAdmin, FindUsersFrequentlyLoggedInController); 

// Delete user by identifier (id)
router.delete('/admin/users/:id', verifyToken, requireAdmin, DeleteUserController); 

module.exports = router;