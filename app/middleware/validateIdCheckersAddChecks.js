// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdCheckersAddChecks = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idCheckerChecks = data["id-checker-checks"];
    const idCheckerName = data["id-checker-first-name"] + " " + data["id-checker-last-name"];
    const inputCache = loadPageData(request);
    const redirectPathIdCheckersAddCheckAnswers = "id-checkers-add-check-answers";
    const redirectPathIdCheckersAddClientOrganisations = "id-checkers-add-client-organisations";
    const renderPath = "registered-body/id-checkers-add-checks";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathIdCheckersAddClientOrganisations;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for who the ID Checker will be
     * doing checks for. */
    if (!idCheckerChecks) {
        dataValidation["id-checker-checks"] = "Select who " + idCheckerName +  " will be doing ID checks for";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["id-checker-checks"] = idCheckerChecks;
        if (idCheckerChecks === "Own organisation") {
            redirectPath = redirectPathIdCheckersAddCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckersAddChecks = validateIdCheckersAddChecks;