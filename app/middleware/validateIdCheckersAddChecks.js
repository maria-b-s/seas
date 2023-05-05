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
    const inputCache = loadPageData(request);
    const redirectPathIdCheckersAddCheckAnswers = "id-checkers-add-check-answers";
    const redirectPathIdCheckersAddClientOrganisations = "id-checkers-add-client-organisations";
    const renderPath = "registered-body/id-checkers-add-checks";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathIdCheckersAddClientOrganisations;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for whether or not the ID Checker
     * will be doing checks for client organisations. */
    if (!idCheckerChecks) {
        dataValidation["id-checker-checks"] = "Select if the ID Checker will be doing checks for client organisations";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["id-checker-checks"] = idCheckerChecks;
        if (idCheckerChecks === "No") {
            redirectPath = redirectPathIdCheckersAddCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckersAddChecks = validateIdCheckersAddChecks;