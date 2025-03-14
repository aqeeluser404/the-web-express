const RentalService = require('../services/rentalService');

module.exports.CreateRentalController = async (req, res) => {
    try {
        const { rental, accessKey } = await RentalService.CreateRentalService(req.body);
        res.status(201).json({ message: 'Rental created successfully', rental, accessKey });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create rental', error: error.toString() });
    }
};

module.exports.DeleteRentalController = async (req, res) => {
    try {
        const { id } = req.params;
        await RentalService.DeleteRentalService(id);
        res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete rental', error: error.toString() });
    }
};

module.exports.FindRentalByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const rental = await RentalService.FindRentalByIdService(id);
        res.status(200).json(rental);
    } catch (error) {
        res.status(404).json({ message: 'Failed to find rental', error: error.toString() });
    }
};

module.exports.FindAllRentalsController = async (req, res) => {
    try {
        const rentals = await RentalService.FindAllRentalsService();
        res.status(200).json(rentals);
    } catch (error) {
        res.status(404).json({ message: 'Failed to find rentals', error: error.toString() });
    }
};

module.exports.FindAllMyRentalsController = async (req, res) => {
    try {
        const { id } = req.params;
        const rentals = await RentalService.FindAllMyRentalsService(id);
        res.status(200).json(rentals);
    } catch (error) {
        res.status(404).json({ message: 'Failed to find user rentals', error: error.toString() });
    }
};

module.exports.UpdateRentalStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const rentalDetails = req.body;
        const updatedRental = await RentalService.UpdateRentalService(id, rentalDetails);
        res.status(200).json(updatedRental);
    } catch (error) {
        res.status(404).json({ message: 'Failed to update rental', error: error.toString() });
    }
};

// module.exports.verifyAndSavePayerController = async (req,res) => {
//     try {
//         const { id } = req.params;
//         const payerData = req.body;

//         const verificationResult = await RentalService.verifyAndSavePayerService(id, payerData);
//         if (!verificationResult) {
//             return res.status(400).json({ error: 'Verification failed.' });
//         }
//         res.status(200).json(verificationResult)
//     } catch (error) {
//         res.status(error.status || 500).json({ error: error.message });
//     }
// }

module.exports.verifyAndSavePayerController = async (req, res) => {
    try {
        const { id } = req.params; // Rental ID
        const rentalData = req.body; // Payer info from the request body

        const verificationResult = await RentalService.verifyAndSavePayerService(id, rentalData);
        res.status(200).json(verificationResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports.EarlyEndRentalController = async (req, res) => {
    try {
        const { id } = req.params;
        await RentalService.EarlyEndRentalService(id);
        res.status(200).json({ message: 'Rental ended successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to end rental', error: error.toString() });
    }
};