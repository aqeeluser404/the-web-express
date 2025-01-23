const UnitService = require('../services/unitService');

module.exports.CreateUnitController = async (req, res) => {
    const { body: unitDetails, files: unitImg } = req;

    try {
        const result = await UnitService.CreateUnitService(unitDetails, unitImg);
        res.status(201).json({ message: 'Unit created successfully', result });
    } catch (error) {
        console.error('Error creating unit:', error.message);
        res.status(400).json({ error: 'An error occurred while creating the unit' });
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