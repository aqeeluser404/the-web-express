// const Rental = require('../models/rentalModel')

// module.exports.VerifyIdService = async () => {

// }

// module.exports.VerifyEmailService = async (email) => {
//     try {
//         const response = await axios.get(`https://api.trumail.io/v2/lookups/json?email=${email}`);
//         if (response.data.deliverable) {
//             return { isValid: true, message: 'Email is valid' };
//         } else {
//             return { isValid: false, message: 'Email is invalid' };
//         }
//     } catch (error) {
//         throw error;
//     }
// };