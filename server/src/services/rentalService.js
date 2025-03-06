const Rental = require('../models/rentalModel');
const Unit = require('../models/unitModel');
const User = require('../models/userModel')
const UnitService = require('../services/unitService')
const crypto = require('crypto');

// module.exports.CreateRentalService = async (rentalDetails) => {
//     try {
//       const unit = await Unit.findById(rentalDetails.unit);
//       const user = await User.findById(rentalDetails.user);
//       if (!unit) { throw new Error('Unit not found'); }
//       if (!user) { throw new Error('User not found'); }
//       if (unit.currentOccupants >= unit.unitOccupants) { throw new Error('Unit is already at full capacity'); }
  
//       const activeOrPendingRentals = await Rental.find({
//         user: rentalDetails.user,
//         status: { $in: ['Pending', 'Active'] },
//       });
  
//       if (activeOrPendingRentals.length > 0) {
//         throw new Error('User already has an active or pending rental');
//       }
  
//       console.log('Rental Details:', rentalDetails);
//       // Handle access key and gender assignment
//       let accessKey;
//       if (rentalDetails.accessKeyIsTrue) {
//         if (unit.accessKey.isShared) {
//           // Unit already has a shared key
//           if (rentalDetails.accessKey !== unit.accessKey.assignedKey) {
//             throw new Error('Invalid access key');
//           }
//           accessKey = unit.accessKey.assignedKey; // Use the existing key
//         } else {
//           // Generate a new access key
//           accessKey = crypto.randomBytes(8).toString('hex');
//           unit.accessKey = { isShared: true, assignedKey: accessKey };
//           console.log('Before Save:', unit);
//         }
//       } else {
//         // Check and set gender assignment if accessKey is not shared
//         if (!unit.genderAssignment) {
//           unit.genderAssignment = user.gender;
//         } else if (unit.genderAssignment !== user.gender) {
//           throw new Error(`This unit is only available for ${unit.genderAssignment}s.`);
//         }
//       }
  
//       // Increment currentOccupants before saving the unit
//       unit.currentOccupants += 1;
//       await unit.save();
//       console.log('After Save:', unit);
  
//       // Create the rental
//       const rentalModelData = new Rental({
//         applicationDate: new Date(),
//         status: 'Pending',
//         rentalStartDate: rentalDetails.rentalStartDate || null,
//         rentalEndDate: rentalDetails.rentalEndDate || null,
//         rentalPrice: unit.unitPrice,
//         unit: unit._id,
//         unitType: unit.unitType,
//         user: rentalDetails.user,
//         accessKey: accessKey || null, // Assign the access key
//       });
  
//       console.log('Rental Model Data:', rentalModelData);
  
//       await rentalModelData.save();
  
//       // Update user and unit
//       await User.findOneAndUpdate(
//         { _id: rentalDetails.user },
//         { $push: { rentals: rentalModelData._id } },
//         { new: true }
//       );
  
//       unit.rentedHistory.push(rentalModelData._id);
//       await unit.save();
  
//       return { rental: rentalModelData, accessKey };
//     } catch (error) {
//       throw error;
//     }
// };

module.exports.CreateRentalService = async (rentalDetails) => {
    try {
      const unit = await Unit.findById(rentalDetails.unit);
      const user = await User.findById(rentalDetails.user);
      if (!unit) { throw new Error('Unit not found'); }
      if (!user) { throw new Error('User not found'); }
      if (unit.currentOccupants >= unit.unitOccupants) { throw new Error('Unit is already at full capacity'); }
  
      const activeOrPendingRentals = await Rental.find({
        user: rentalDetails.user,
        status: { $in: ['Pending', 'Active'] },
      });
  
      if (activeOrPendingRentals.length > 0) {
        throw new Error('User already has an active or pending rental');
      }
  
      console.log('Rental Details:', rentalDetails);
      // Handle access key and gender assignment
      let accessKey;
      if (rentalDetails.accessKeyIsTrue) {
        if (unit.accessKey.isShared) {
          // Unit already has a shared key
          if (rentalDetails.accessKey !== unit.accessKey.assignedKey) {
            throw new Error('Invalid access key');
          }
          accessKey = unit.accessKey.assignedKey; // Use the existing key
        } else {
          // Generate a new access key
          accessKey = crypto.randomBytes(8).toString('hex');
          unit.accessKey = { isShared: true, assignedKey: accessKey };
          console.log('Before Save:', unit);
        }
      } else {
        // Check and set gender assignment if accessKey is not shared
        if (!unit.accessKey.isShared) {
          if (!unit.genderAssignment) {
            unit.genderAssignment = user.gender;
          } else if (unit.genderAssignment !== user.gender) {
            throw new Error(`This unit is only available for ${unit.genderAssignment}s.`);
          }
        }
      }
  
      // Increment currentOccupants before saving the unit
      unit.currentOccupants += 1;
      await unit.save();
      console.log('After Save:', unit);
  
      // Create the rental
      const rentalModelData = new Rental({
        applicationDate: new Date(),
        status: 'Pending',
        rentalStartDate: rentalDetails.rentalStartDate || null,
        rentalEndDate: rentalDetails.rentalEndDate || null,
        rentalPrice: unit.unitPrice,
        unit: unit._id,
        unitType: unit.unitType,
        user: rentalDetails.user,
        accessKey: accessKey || unit.accessKey.assignedKey || null, // Assign the access key
      });
  
      console.log('Rental Model Data:', rentalModelData);
  
      await rentalModelData.save();
  
      // Update user and unit
      await User.findOneAndUpdate(
        { _id: rentalDetails.user },
        { $push: { rentals: rentalModelData._id } },
        { new: true }
      );
  
      unit.rentedHistory.push(rentalModelData._id);
      await unit.save();
  
      return { rental: rentalModelData, accessKey };
    } catch (error) {
      throw error;
    }
};

// ONLY DELETE RENTAL IF ITS PENDING OR REJECTED
module.exports.DeleteRentalService = async (rentalId) => {
    try {
        const rental = await Rental.findById(rentalId);
        if (!rental) {
            throw new Error('Rental not found');
        }

        // Check if the rental is not approved
        if (rental.status !== 'Pending' && rental.status !== 'Rejected') {
            throw new Error('Cannot delete an approved rental');
        }

        // Remove rental from user's rentals
        await User.findByIdAndUpdate(
            rental.user,
            { $pull: { rentals: rental._id } },
            { new: true }
        );

        // Remove rental from unit's rentedHistory and decrement current occupants
        const unit = await Unit.findById(rental.unit);
        if (unit) {
            unit.currentOccupants -= 1;
            unit.rentedHistory.pull(rental._id);
            await unit.save();
        }

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
        // const rentalToUpdate = await Rental.findById(rentalId);
        // if (!rentalToUpdate) {
        //     throw new Error('Rental not found');
        // }
        // rentalToUpdate.status = rentalDetails.status;
        
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
        rental.status = 'Ended';
        await rental.save();

        const unit = await Unit.findById(rental.unit);
        if (!unit) {
            throw new Error('Unit not found');
        }
        // Decrement current occupants and update unit status
        unit.currentOccupants -= 1;
        await unit.save();
        
        return rental;
    } catch (error) {
        throw error
    }
}
module.exports.EarlyEndRentalService = async (rentalId) => {
    try {
        const rental = await Rental.findById(rentalId);
        if (!rental) {
            throw new Error('Rental not found');
        }
        const unit = await Unit.findById(rental.unit);
        if (!unit) {
            throw new Error('Unit not found');
        }

        if (rental.status !== "Active") {
            throw new Error("Cannot end a rental if it was not approved");
        }

        // Update rental status
        rental.status = 'Ended';
        rental.earlyEndDate = new Date();
        await rental.save();

        // Decrement current occupants and update unit status
        unit.currentOccupants -= 1;
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