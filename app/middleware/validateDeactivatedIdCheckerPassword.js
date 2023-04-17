// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { activateAndSelectDeactivatedIdChecker } = require('./utilsDeactivatedIdChecker');
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateDeactivatedIdCheckerPassword = (request, response) => {
    // Constants.
    const data = request.session.data;
    const deactivatedIdCheckerPassword = data["deactivated-id-checker-password"];
    const deactivatedIdCheckerPasswordConfirm = data["deactivated-id-checker-password-confirm"];
    const inputCache = loadPageData(request);
    const regExpPassword = /^.{8,}$/;
    const renderPath = "seas-idc/create-password";

    // Properties.
    let dataValidation = {};
    let redirectPath = "dashboard";

    /* Validates that a password was submitted by the deactivated identity
     * checker and that it (i) has been confirmed to reduce human error, and
     * (ii) has the minimum number of required characters. */
    if (!deactivatedIdCheckerPassword) {
        dataValidation["deactivated-id-checker-password"] = "Enter a password";
    } else {
        const validDeactivatedIdCheckerPassword = regExpPassword.test(deactivatedIdCheckerPassword);
        if (!validDeactivatedIdCheckerPassword) {
            dataValidation["deactivated-id-checker-password"] = "Password is too short, enter 8 or more characters";
        } else if (!deactivatedIdCheckerPasswordConfirm) {
            dataValidation["deactivated-id-checker-password"] = "Enter a password";
            dataValidation["deactivated-id-checker-password-confirm"] = "Repeat password to confirm";
        } else if (deactivatedIdCheckerPassword !== deactivatedIdCheckerPasswordConfirm) {
            dataValidation["deactivated-id-checker-password"] = "Password and confirm password do not match";
        }
    }

    // Cache session.
    savePageData(request, data);

    // Response. 
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        /* Activates the deactivated ID checker and selects the now activated ID
         * Checker for use within /dashboard. */
        activateAndSelectDeactivatedIdChecker(request);
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateDeactivatedIdCheckerPassword = validateDeactivatedIdCheckerPassword;