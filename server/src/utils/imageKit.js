const ImageKit = require('imagekit');

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// DOCUMENTS --------------------------------------------------------------------------------
const uploadDocumentToImageKit = async (file) => {
    try {
        const result = await imageKit.upload({
            file: file.buffer,
            fileName: file.originalname
        });
        return {
            documentUrl: result.url,
            fileId: result.fileId // Store this ID for deletion
        };
    } catch (error) {
        console.error('Error uploading document to ImageKit:', error.message);
        throw error;
    }
};

const deleteDocumentFromImageKit = async (fileId) => {
    try {
        await imageKit.deleteFile(fileId);
    } catch (error) {
        console.error('Error deleting document from ImageKit:', error.message);
        throw error;
    }
};

// IMAGES --------------------------------------------------------------------------------
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

const deleteImageFromImageKit = async (fileId) => {
    try {
        const response = await imageKit.deleteFile(fileId);
        console.log(`Deleted image from ImageKit: ${fileId}`);
    } catch (error) {
        console.error(`Failed to delete image from ImageKit: ${fileId}`, error.message);
        console.error(`Error details:`, error.response ? error.response.data : 'No response data');
    }
};

module.exports = { 
    uploadDocumentToImageKit, 
    deleteDocumentFromImageKit,
    uploadImageToImageKit,
    deleteImageFromImageKit
};