const validator = require('validator');

const validateEmail = (email) => {
    return validator.isEmail(email);
};

const validatePhone = (phone) => {
    // Remove any non-digit characters except leading +
    const cleanedPhone = phone.replace(/[^+\d]/g, '');

    // Validate Pakistan numbers specifically
    if (cleanedPhone.startsWith('+92')) {
        // Pakistan numbers: +92 followed by 10 digits
        return cleanedPhone.length === 13 && /^\+92[0-9]{10}$/.test(cleanedPhone);
    }

    if (cleanedPhone.startsWith('92')) {
        // Pakistan numbers without + prefix
        return cleanedPhone.length === 12 && /^92[0-9]{10}$/.test(cleanedPhone);
    }

    if (cleanedPhone.startsWith('0')) {
        // Pakistan numbers with local 0 prefix
        return cleanedPhone.length === 11 && /^0[0-9]{10}$/.test(cleanedPhone);
    }

    // Validate international numbers
    return validator.isMobilePhone(cleanedPhone, 'any', { strictMode: false });
};

const formatPhoneForPakistan = (phone) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');

    // If it's a Pakistan number without country code, add it
    if (digits.length === 10 && digits.startsWith('3')) {
        return '+92' + digits;
    }

    // If it's a Pakistan number with 0 prefix, replace with +92
    if (digits.length === 11 && digits.startsWith('03')) {
        return '+92' + digits.substring(1);
    }

    // If it's a Pakistan number with 92 prefix but missing +
    if (digits.length === 12 && digits.startsWith('92')) {
        return '+' + digits;
    }

    // If it already has country code, ensure it starts with +
    if (digits.length > 10 && !phone.startsWith('+')) {
        return '+' + digits;
    }

    return phone;
};

const extractTemplateVariables = (content) => {
    const variableRegex = /{(\w+)}/g;
    const variables = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
        variables.push(match[1]);
    }

    return [...new Set(variables)]; // Remove duplicates
};

module.exports = {
    validateEmail,
    validatePhone,
    formatPhoneForPakistan,
    extractTemplateVariables
};