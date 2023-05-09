// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { addNewIdChecker } = require("./utilsIdCheckers");
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdCheckersAddCheckAnswers = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idCheckerAddAdditional = data["id-checker-add-additional"];
    const inputCache = loadPageData(request);
    const redirectPathIdCheckersAddConfirmation = "id-checkers-add-confirmation";
    const registeredBody = request.session.selectedRB;
    const renderPath = "registered-body/id-checkers-add-check-answers";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathIdCheckersAddConfirmation;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for whether or not another ID
     * Checker is to be added. */
    if (!idCheckerAddAdditional) {
        dataValidation["id-checker-add-additional"] = "Select if you want to add another ID Checker";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, registeredBody: registeredBody, validation: dataValidation });
    } else {
        request.session.data["id-checker-add-additional"] = idCheckerAddAdditional;
        if (idCheckerAddAdditional === "Yes") {
            data["id-checker-add-additional"] = "";
            redirectPath = "#";
        } else {
            /* Stores the captured details of the new ID checkers submitted by the
            * registered body. */
            addNewIdChecker(request);
            /* Removes the captured details of the new ID checker from the
            * registered body's session; they have been stored. */
            data["id-checker-add-additional"] = "";
            data["id-checker-checks"] = "";
            data["id-checker-client-organisations"] = "";
            data["id-checker-declare"] = "";
            data["id-checker-email-address-confirm"] = "";
            data["id-checker-email-address"] = "";
            data["id-checker-first-name"] = "";
            data["id-checker-last-name"] = "";
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckersAddCheckAnswers = validateIdCheckersAddCheckAnswers;