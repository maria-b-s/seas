// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateExistingPostHolder = (request, response) => {
    // Constants.
    const data = request.session.data;
    const inputCache = loadPageData(request);
    const rechecked = data["rechecked"];
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const redirectPathApplicantName = "/registered-body/applicant-name";
    const renderPath = "registered-body/existing-post-holder";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathApplicantName;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for whether or not the application
     * is for a recheck. */
    if (!rechecked) {
        dataValidation["rechecked"] = "Select if this application is for a recheck";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["rechecked"] = rechecked;
        if (request.query && request.query.change) {
            redirectPath = redirectPathCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateExistingPostHolder = validateExistingPostHolder;