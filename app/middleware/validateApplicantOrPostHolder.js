// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistChangeQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateApplicantOrPostHolder = (request, response) => {
    // Constants.
    const data = request.session.data;
    const historicWhatApplicationType = data["historic_what-application-type"];
    const inputCache = loadPageData(request);
    const rechecked = data["rechecked"];
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const redirectPathExistingPostHolder = persistChangeQueryStringFromRequestForPath(request, "existing-post-holder");
    const redirectPathVolunteerDeclaration = persistChangeQueryStringFromRequestForPath(request, "volunteer-declaration");
    const renderPath = "registered-body/applicant-or-post-holder";
    const whatApplicationType = data["what-application-type"];

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathExistingPostHolder;

    // Cache session.
    savePageData(request, data);

    /* Validates that a radio button is checked for the kind of applicant the
     * check is for. */
    if (!whatApplicationType) {
        dataValidation["what-application-type"] = "Select what kind of applicant the check is for";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["what-application-type"] = request.body["what-application-type"];
        switch (whatApplicationType) {
            case "New employee":
            case "Current employee":
                // New employee or current employee.

                /* Removes the previously declared free-of-charge volunteer
                 * declaration; it is no longer relevant. */ 
                data["foc_declare"] = undefined;

                /* Responds with "Check your answers" if it is known whether or
                 * not the application is for a recheck. */
                if (rechecked && (request.query && request.query.change)) {
                    redirectPath = redirectPathCheckAnswers;
                }
                break;
            case "Volunteer":
                // Free-of-charge volunteer.

                /* Removes the previously selected option regarding whether or
                 * not the application is for a recheck; it is no longer
                 * relevant. */ 
                data["rechecked"] = undefined;

                redirectPath = redirectPathVolunteerDeclaration;
                break;
            default:
                break;
        }
        if (request.query && request.query.change) {
            /* Verifies whether or not the registered body made a change to
             * the kind of applicant the check is for. */ 
            if (historicWhatApplicationType && (historicWhatApplicationType === whatApplicationType)) {
                redirectPath = redirectPathCheckAnswers;
            }
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateApplicantOrPostHolder = validateApplicantOrPostHolder;