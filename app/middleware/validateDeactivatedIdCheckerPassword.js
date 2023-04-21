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
    const inputCharactersMinimum = 8;
    const redirectPathDashboard = "dashboard";
    const regExpPassword = /^.{8,}$/;
    const renderPath = "seas-idc/create-password";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathDashboard;

    // Cache session.
    savePageData(request, data);

    /* Validates that a password was submitted by the deactivated identity
     * checker and that it (i) has been confirmed to reduce human error, and
     * (ii) has the minimum number of required characters. */
    if (!deactivatedIdCheckerPassword || !deactivatedIdCheckerPasswordConfirm) {
        dataValidation["deactivated-id-checker-password"] = "Enter password";
        dataValidation["deactivated-id-checker-password-confirm"] = "Enter confirm password";
    } else {
        const validDeactivatedIdCheckerPassword = regExpPassword.test(deactivatedIdCheckerPassword);
        const validDeactivatedIdCheckerPasswordConfirm = regExpPassword.test(deactivatedIdCheckerPasswordConfirm);
        if (deactivatedIdCheckerPassword !== deactivatedIdCheckerPasswordConfirm) {
            dataValidation["deactivated-id-checker-password"] = "Password and confirm password do not match";
            dataValidation["deactivated-id-checker-password-confirm"] = " ";
        } else if (!validDeactivatedIdCheckerPassword && !validDeactivatedIdCheckerPasswordConfirm) {
            dataValidation["deactivated-id-checker-password"] = `Password must be ${ inputCharactersMinimum } characters or more`;
            dataValidation["deactivated-id-checker-password-confirm"] = `Confirm password must be ${ inputCharactersMinimum } characters or more`;
        } else if (!validDeactivatedIdCheckerPassword) {
            dataValidation["deactivated-id-checker-password"] = `Password must be ${ inputCharactersMinimum } characters or more`;
        } else if (!validDeactivatedIdCheckerPasswordConfirm) {
            dataValidation["deactivated-id-checker-password-confirm"] = `Confirm password must be ${ inputCharactersMinimum } characters or more`;
        }
    }

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