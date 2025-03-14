require('dotenv').config();

const validateSouthAfricanID = (idNumber) => {
    idNumber = String(idNumber); // Force to string

    // Basic validation of South African ID number structure: 13 digits
    if (!/^\d{13}$/.test(idNumber)) {
        console.error("Invalid ID format:", idNumber);
        return { isValid: false, message: 'Invalid ID number format' };
    }

    // Checksum validation
    let sum = 0;
    let shouldDouble = false;

    for (let i = 0; i < 12; i++) {
        const char = idNumber.charAt(i);
        const digit = parseInt(char, 10);

        if (isNaN(digit)) {
            console.error("Non-numeric character found:", char);
            return { isValid: false, message: 'ID number contains non-numeric characters' };
        }

        if (shouldDouble) {
            let doubled = digit * 2;
            if (doubled > 9) {
                doubled -= 9;
            }
            sum += doubled;
        } else {
            sum += digit;
        }
        shouldDouble = !shouldDouble;
    }

    const checksum = (10 - (sum % 10)) % 10;
    const isValid = checksum === parseInt(idNumber.charAt(12), 10);

    console.log("Checksum result:", { sum, checksum, isValid });

    return { isValid, message: isValid ? 'ID number is valid' : 'Invalid ID number checksum' };
};


const scorePayerData = (payerData) => {
    let score = 0;
    
    // 1. Validate ID number and score
    const idValidation = validateSouthAfricanID(payerData.idNumber);
    score += idValidation.isValid ? 30 : 0;  // 30 points for valid ID number
    console.log("ID Score: ", score)

    // 2. Check if first name is non-empty
    if (payerData.firstName && /^[A-Za-z]+$/.test(payerData.firstName)) {
        score += 10;  // 10 points for valid first name
        console.log("First Name Score: ", score)
    }

    // 3. Check if last name is non-empty
    if (payerData.lastName && /^[A-Za-z]+$/.test(payerData.lastName)) {
        score += 10;  // 10 points for valid last name
        console.log("Last Name Score: ", score)
    }

    // 4. Check if salary is a valid number within a reasonable range
    if (payerData.salary && !isNaN(payerData.salary)) {
        const salary = parseFloat(payerData.salary);
        if (salary >= 2000 && salary <= 100000) {  // reasonable salary range check
            score += 20;  // 20 points for valid salary
            console.log("Salary Score: ", score)
        }
    }

    // 5. Check if bank name is non-empty
    if (payerData.bankName) {
        const bankName = typeof payerData.bankName === 'object' ? payerData.bankName.value : payerData.bankName; // Extract value
        if (/^[A-Za-z ]+$/.test(bankName)) {
            score += 10; // 10 points for non-empty, valid bank name
            console.log("Bank Score: ", score);
        } else {
            console.log("Invalid Bank Name Format:", bankName);
        }
    }

    return score;
};


module.exports = { scorePayerData };