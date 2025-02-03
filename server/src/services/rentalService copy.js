const Rental = require('../models/rentalModel');
const Unit = require('../models/unitModel');
const User = require('../models/userModel')

module.exports.CreateRentalService = async (rentalDetails) => {
    try {
        // Check if rental already exists based on unitNumber and applicationDate
        const existingRental = await Rental.findOne({
            unit: rentalDetails.unit,
            applicationDate: rentalDetails.applicationDate        
        });
        if (existingRental) {
            throw new Error('Rental already exists for this unit and application date');
        }

        // Check if unit is available
        const unitAvailability = await Unit.findOne({ _id: rentalDetails.unit });
        if (unitAvailability.unitStatus === 'Occupied') {
            throw new Error('Unit is already occupied');
        }

        // Update unit status
        unitAvailability.unitStatus = 'Occupied';
        await unitAvailability.save();

        // Create rental
        const rentalModelData = new Rental({
            applicationDate: new Date(),     // Application date
            status: 'Pending',  // This can be updated once the documents are uploaded
            rentalStartDate: rentalDetails.rentalStartDate || null,    // This can be updated once the documents are uploaded
            rentalEndDate: rentalDetails.rentalEndDate || null,  
            rentalPrice: unitAvailability.unitPrice,    // Get from the checking unit var
            unit: unitAvailability._id,    // Get from the checking unit var
            unitType: unitAvailability.unitType,    // Get from the checking unit var
            user: rentalDetails.user
        });

        // Save rental
        await rentalModelData.save();

        // Update user with rental
        await User.findOneAndUpdate(
            { _id: rentalDetails.user }, 
            { $push: { rentals: rentalModelData._id } }, 
            { new: true }
        );

        // Update the rental history in unit
        await Unit.findOneAndUpdate(
            { _id: unitAvailability._id }, 
            { $push: { rentedHistory: rentalModelData._id } }, 
            { new: true }
        );

        return rentalModelData;
    } catch (error) {
        throw error;
    }
};

module.exports.DeleteRentalService = async (rentalId) => {
    try {
        const rental = await Rental.findById(rentalId);
        if (!rental) {
            throw new Error('Rental not found');
        }

        // Check if the rental is not approved
        if (rental.status !== 'Pending') {
            throw new Error('Cannot delete an approved rental');
        }

        // Remove rental from user's rentals
        await User.findByIdAndUpdate(
            rental.user,
            { $pull: { rentals: rental._id } },
            { new: true }
        );

        // Remove rental from unit's rentedHistory
        await Unit.findByIdAndUpdate(
            rental.unit,
            { $pull: { rentedHistory: rental._id } },
            { new: true }
        );

        // Update unit status to 'Available'
        await Unit.findByIdAndUpdate(
            rental.unit,
            { unitStatus: 'Available' },
            { new: true }
        );

        // Delete the rental
        await Rental.findByIdAndDelete(rentalId);

        return true;
    } catch (error) {
        throw error;
    }
};

module.exports.FindRentalByIdService = async (id) => {
    try {
        const rental = await Rental.findById(id);
        if (!rental) {
            throw new Error('Rental not found');
        }
        return rental;
    } catch (error) {
        throw error;
    }
}

module.exports.FindAllRentalsService = async () => {
    try {
        const rentals = await Rental.find()
        return rentals
    } catch (error) {
        throw error
    }
}

module.exports.FindAllMyRentalsService = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }
        const rentals = await Rental.find({ _id: { $in: user.rentals }})
        return rentals
    } catch (error) {
        throw error
    }
}

module.exports.UpdateRentalService = async (rentalId, rentalDetails) => {
    try {
        const rentalToUpdate = await Rental.findByIdAndUpdate(rentalId, rentalDetails, {new: true})
        if (!rentalToUpdate) {
            throw new Error('Rental not found');
        }
        return rentalToUpdate
    } catch (error) {
        throw error
    }
}

module.exports.EndRentalService = async (rentalId) => {
    try {
        const rental = await Rental.findById(rentalId);
        if (!rental) {
            throw new Error('Rental not found');
        }
        const unit = await Unit.findOne({ _id: rental.unit });
        if (!unit) {
            throw new Error('Unit not found');
        }

        if (rental.status !== "Approved") {
            throw new Error("Cannot end a rental if it was not approved")
        }

        // Update rental status
        rental.status = 'Rental closed';
        rental.rentalEndDate = new Date();

        // Reset the unit status
        unit.status = 'Available';

        // Save the changes
        await rental.save();
        await unit.save();

        return rental;
    } catch (error) {
        throw error;
    }
};

// module.exports.UpdateRentalStatusService = async (rentalId) => {
//     try {
//         const rental = await Rental.findById(rentalId);
//         if (!rental) {
//             throw new Error('Rental not found');
//         }
//         rental.status = 'Approved';
//         await rental.save();
//         return rental;
//     } catch (error) {
//         throw error;
//     }
// };


// module.exports.UpdateRentalDatesService = async (rentalId, startDate, endDate) => {
//     try {
//         const rental = await Rental.findById(rentalId);
//         if (!rental) {
//             throw new Error('Rental not found');
//         }
//         rental.rentalStartDate = startDate;
//         rental.rentalEndDate = endDate;
//         await rental.save();
//         return rental;
//     } catch (error) {
//         throw error;
//     }
// };