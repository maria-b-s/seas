// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { persistChangeQueryStringFromRequestForPath } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateDbsCheckLevel = (request, response) => {
    // Constants.
    const data = request.session.data;
    const historicWhatDbsCheck = data["historic_what-dbs-check"];
    const inputCache = loadPageData(request);
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const redirectPathWorkforceSelect = persistChangeQueryStringFromRequestForPath(request, "workforce-select");
    const renderPath = "registered-body/dbs-check-level";
    const whatDbsCheck = data["what-dbs-check"];

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathWorkforceSelect;

    // Cache session.
    savePageData(request, request.body);

    // Validates that the type of DBS check required has been selected.
    if (!whatDbsCheck) {
        dataValidation["what-dbs-check"] = "Select which DBS check you are requesting";
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        if (request.query && request.query.change) {
            /* Verifies whether or not the registered body made a change to the
             * type of DBS check requested. */ 
            if (historicWhatDbsCheck && (historicWhatDbsCheck === whatDbsCheck)) {
                redirectPath = redirectPathCheckAnswers;
            } else if (whatDbsCheck === "Standard") {
                /* Removes any irrelevant selections made for the adult barred
                 * list check; child barred list check; and applicant working
                 * with adults or children in their home address. */
                data["barred-adults"] = undefined;
                data["barred-children"] = undefined;
                data["children-or-adults"] = undefined;
                redirectPath = redirectPathCheckAnswers;
            } else if (whatDbsCheck === "Enhanced") {
                /* Removes any previously selected workforce that the applicant
                 * will be working in. */ 
                data["workforce-selected"] = undefined;
            }
        }
        if ((whatDbsCheck === "Enhanced") && (redirectPath !== redirectPathCheckAnswers)) {
            redirectPath = "enhanced/" + redirectPath;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateDbsCheckLevel = validateDbsCheckLevel;