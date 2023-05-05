// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdCheckersAddEmailAddress = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idCheckerEmail = data["id-checker-email"];
    const idCheckerEmailConfirm = data["id-checker-email-confirm"];
    const inputCache = loadPageData(request);
    const inputCharactersMaximum = 100;
    const redirectPathIdCheckersAddChecks = "id-checkers-add-checks";
    const regExpEmailAddress = /^(?!\.)(?!.*\.\.)(?!.*\.$)(?!.*@.*@)[a-zA-Z0-9&'+=_\-\/]([\.a-zA-Z0-9&'+=_\-\/]){0,63}@[a-zA-Z0-9\-]{1,63}(\.([a-zA-Z0-9\-]){1,63}){0,}$/;
    const renderPath = "registered-body/id-checkers-add-email-address";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathIdCheckersAddChecks;

    // Cache session.
    savePageData(request, data);

    // Validates if the ID Checker's email address is genuine.
    if (!idCheckerEmail) {
        dataValidation["id-checker-email"] = "Enter email address";
    } else {
        const validApplicantEmail = regExpEmailAddress.test(idCheckerEmail);
        if (!validApplicantEmail) {
            dataValidation["id-checker-email"] = "Enter email address in the correct format";
        } else if (idCheckerEmail.length > inputCharactersMaximum) {
            dataValidation["id-checker-email"] = `Email address must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }
    /* Validates if the ID Checker's has successfully confirmed their email
     * address. */
    if (!idCheckerEmailConfirm) {
        dataValidation["id-checker-email-confirm"] = "Enter confirm email address";
    } else {
        const validApplicantEmail = regExpEmailAddress.test(idCheckerEmail);
        const validApplicantEmailConfirm = regExpEmailAddress.test(idCheckerEmailConfirm);
        if (!validApplicantEmailConfirm) {
            dataValidation["id-checker-email-confirm"] = "Enter confirm email address in the correct format";
        } else if (idCheckerEmailConfirm.length > inputCharactersMaximum) {
            dataValidation["id-checker-email-confirm"] = `Confirm email address must be ${ inputCharactersMaximum } characters or fewer`;
        } else if (validApplicantEmail && validApplicantEmailConfirm) {
            if (idCheckerEmail !== idCheckerEmailConfirm) {
                dataValidation["id-checker-email"] = "Email address and confirm email address do not match";
                dataValidation["id-checker-email-confirm"] = " ";
            }
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["id-checker-email"] = request.body["id-checker-email"];
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckersAddEmailAddress = validateIdCheckersAddEmailAddress;