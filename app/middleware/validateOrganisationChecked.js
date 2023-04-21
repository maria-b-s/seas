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
    const redirectPathApplicantOrPostHolder = "applicant-or-post-holder";
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const renderPath = "registered-body/organisation-name";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathApplicantOrPostHolder;

    // Cache session.
    savePageData(request, data);

    // Validates that a radio button is checked for the type of organisation.
    if (!organisationChecked) {
        dataValidation["organisation-check"] = "Select which organisation the check is for";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["organisation-check"] = request.body["organisation-check"];
        if (organisationChecked === "my-organisation") {
            /* Removes the previously selected client organisation; it is no
             * longer relevant. */ 
            data["client-organisation"] = undefined;
        }
        /* Responds with "Check your answers" if the type of organisation was
         * requested to be changed from a previous submission. */
        if (request.query && request.query.change) {
            redirectPath = redirectPathCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateOrganisationChecked = validateOrganisationChecked;