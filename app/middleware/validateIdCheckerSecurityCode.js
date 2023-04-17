// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdCheckerSecurityCode = (request, response) => {
    // Constants.
    const data = request.session.data;
    const selectedIDC = request.session.selectedIDC;
    const idCheckerSecurityCode = data["id-checker-security-code"];
    const idCheckerSecurityCodeSent = "666666";
    const inputCache = loadPageData(request);
    const regExpSecurityCode = /^\d+$/;
    const renderPath = "seas-idc/security-code-check";

    // Properties.
    let dataValidation = {};
    let redirectPath = "";

    /* Validates that a 6 digit security code was submitted by the identity
     * checker and that it matches the security code sent to their mobile
     * number. */
    if (!idCheckerSecurityCode) {
        dataValidation["id-checker-security-code"] = "Enter a security code";
    } else {
        const validSecurityCode = regExpSecurityCode.test(idCheckerSecurityCode);
        if (!validSecurityCode) {
            dataValidation["id-checker-security-code"] = "Security code must only include digits";
        } else if (idCheckerSecurityCode.toString().length !== idCheckerSecurityCodeSent.length) {
            dataValidation["id-checker-security-code"] = `Security code must be ${idCheckerSecurityCodeSent.length} digits`;
        } else if (idCheckerSecurityCode !== idCheckerSecurityCodeSent) {
            dataValidation["id-checker-security-code"] = "Security code does not match the one we sent to your mobile";
        }
    }

    // Cache session.
    savePageData(request, data);

    /* Response. This is dependent on either the ID Checker (i) activating their
     * account or (ii) logging into SEAS. If the ID Checker is activating their
     * account they must create a password. Otherwise, they are taken to the
     * application dashboard. NOTE: Solely for demonstration purposes, this use
     * of the ID Checker's password is not be utilized beyond the scope of this
     * prototype. */ 
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        redirectPath = !selectedIDC ? "create-password" : "dashboard";
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckerSecurityCode = validateIdCheckerSecurityCode;