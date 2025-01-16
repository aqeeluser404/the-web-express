const UnitService = require('../services/unitService');
const axios = require('axios');
const FormData = require('form-data');
const ImageKit = require('imagekit');

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImageToImageKit = async (file) => {
    try {
        const result = await imageKit.upload({
            file: file.buffer,
            fileName: file.originalname
        });
        return {
            imageUrl: result.url,
            fileId: result.fileId // Store this ID for deletion
        };
    } catch (error) {
        console.error('Error uploading image to ImageKit:', error.message);
        throw error;
    }
};

module.exports.CreateUnitController = async (req, res) => {
    const { body: unitDetails, files: unitImg } = req;

    try {
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
        await UnitService.CreateUnitService(unitDetails);

        res.status(201).json({ message: 'Unit created successfully' });
    } catch (error) {
        console.error('Error uploading image:', error.message);
        res.status(400).json({ error: 'An error occurred while uploading the image' });
    }
};

module.exports.FindUnitByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const unit = await UnitService.FindUnitByIdService(id);
        res.status(200).json(unit)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.FindAllUnitsController = async (req, res) => {
    try {
        const units = await UnitService.FindAllUnitsService();
        res.status(200).json(units);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.UpdateUnitController = async (req, res) => {
    const { id } = req.params;
    const unitDetails = req.body;
    try {
        if (req.files) {
            unitDetails.images = req.files.map(file => file.path);
        }
        await UnitService.UpdateUnitService(id, unitDetails);
        res.status(200).json({ message: 'Unit updated successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.DeleteUnitController = async (req, res) => {
    try {
        await UnitService.DeleteUnitService(req.params.id);
        res.status(200).json({ message: 'Unit deleted successfully'})
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};