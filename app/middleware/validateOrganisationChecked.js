// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateOrganisationChecked = (request, response) => {
    // Constants.
    const data = request.session.data;
    const organisationChecked = data["organisation-check"];
    const inputCache = loadPageData(request);
    const renderPath = "registered-body/organisation-name";

    // Properties.
    let dataValidation = {};
    let redirectPath = "applicant-or-post-holder";

    // Validates that a radio button is checked for the type of organisation.
    if (!organisationChecked) {
        dataValidation["client-organisation"] = "Select which organisation the check is for";
    }

    // Cache session.
    savePageData(request, data);

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["organisation-check"] = request.body["organisation-check"];
        /* Responds with "Check your answers" if the type of organisation was
         * requested to be changed from a previous submission. */
        if (request.query && request.query.change) {
            redirectPath = "check-answers";
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateOrganisationChecked = validateOrganisationChecked;