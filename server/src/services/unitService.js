const Unit = require('../models/unitModel');
const ImageKit = require('imagekit');

module.exports.CreateUnitService = async (unitDetails) => {
    try {
        const existingUnit = await Unit.findOne({ unitNumber: unitDetails.unitNumber });
        if (existingUnit) {
            throw new Error('Unit already exists');
        }
        const unitModelData = new Unit({
            unitType: unitDetails.unitType,
            // unitDetails: unitDetails.unitDetails,
            bedrooms: unitDetails.bedrooms,
            kitchens: unitDetails.kitchens,
            bathrooms: unitDetails.bathrooms,
            parking: unitDetails.parking,
            lounges: unitDetails.lounges,
            unitDescription: unitDetails.unitDescription,
            unitPrice: unitDetails.unitPrice,
            unitStatus: 'Available',
            images: unitDetails.images,
            dateCreated: new Date()
        });
        await unitModelData.save();
        return true;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Unit already exists');
        }
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

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const deleteImageFromImageKit = async (fileId) => {
    try {
        const response = await imageKit.deleteFile(fileId);
        console.log(`Deleted image from ImageKit: ${fileId}`);
    } catch (error) {
        console.error(`Failed to delete image from ImageKit: ${fileId}`, error.message);
        console.error(`Error details:`, error.response ? error.response.data : 'No response data');
    }
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