const Unit = require('../models/unitModel');
const Rental = require('../models/rentalModel')
const { uploadImageToImageKit, deleteImageFromImageKit } = require('../utils/imageKit')

module.exports.CreateUnitService = async (unitDetails, unitImg) => {
    try {
        const existingUnit = await Unit.findOne({ unitNumber: unitDetails.unitNumber})
        if (existingUnit) {
            throw new Error('Unit with this number already exists');
        }

        if (unitImg && unitImg.length > 0) {
            const uploadPromises = unitImg.map(file => uploadImageToImageKit(file));
            const uploadedImages = await Promise.all(uploadPromises);

            unitDetails.images = uploadedImages.map(img => ({
                imageUrl: img.imageUrl,
                fileId: img.fileId
            }));
        } else {
            unitDetails.images = [];
        }

        const unitModelData = new Unit({
            unitNumber: unitDetails.unitNumber,
            floorLevel: unitDetails.floorLevel,
            unitType: unitDetails.unitType,
            unitOccupants: unitDetails.unitOccupants,
            currentOccupants: 0, // Initialize current occupants to 0
            unitDescription: unitDetails.unitDescription,
            unitPrice: unitDetails.unitPrice,
            unitStatus: 'Available',
            images: unitDetails.images,
            dateCreated: new Date()
        });
        await unitModelData.save();

        return unitModelData;
    } catch (error) {
        throw error;
    }
};

module.exports.FindUnitByIdService = async (unitId) => {
    const unit = await Unit.findById(unitId);
    if (!unit) {
        throw new Error('Unit not found');
    }
    return unit;
};

module.exports.FindAllUnitsService = async () => {
    const units = await Unit.find({});
    if (!units) {
        throw new Error('Units not found');
    }
    return units;
};

module.exports.UpdateUnitService = async (id, unitDetails) => {
    const { images, ...detailsWithoutImages } = unitDetails;
    
    // First, update the unit without the images
    let unit = await Unit.findByIdAndUpdate(id, detailsWithoutImages, { new: true });
    if (!unit) {
        throw new Error('Unit not found');
    }

    // Then, if there are new images, add them to the unit
    if (images && images.length > 0) {
        images.forEach(image => unit.images.push(image));
        unit = await unit.save();
    }
    return unit;
};

// module.exports.ReplaceUnitImagesService = async (id, newImages) => {
//     try {
//         const unit = await Unit.findById(id);
//         if (!unit) {
//             throw new Error('Unit not found');
//         }

//         // Delete existing images from ImageKit
//         for (const image of unit.images) {
//             if (image.fileId) {
//                 await deleteImageFromImageKit(image.fileId);
//             }
//         }

//         // Clear existing images from the unit
//         unit.images = [];

//         // Add new images to the unit
//         if (newImages && newImages.length > 0) {
//             newImages.forEach(image => unit.images.push(image));
//         }

//         // Save the updated unit
//         await unit.save();

//         return unit;
//     } catch (error) {
//         throw error;
//     }
// };

module.exports.DeleteUnitService = async (id) => {
    const unit = await Unit.findById(id);
    if (!unit) {
        throw new Error('Unit not found');
    }

    // Check if the unit is referenced in any previous rentals
    const rentalWithUnit = await Rental.findOne({ unit: id });
    if (rentalWithUnit) {
        throw new Error('Unit cannot be deleted as it is referenced in a previous rental. Please delete the rental first.');
    }

    // Delete the images from ImageKit
    for (const image of unit.images) {
        if (image.fileId) {
            await deleteImageFromImageKit(image.fileId);
        }
    }
    // Delete the unit from the database
    await Unit.findByIdAndDelete(id);

    return true;
};
