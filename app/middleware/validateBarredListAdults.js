// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistChangeQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateBarredListAdults = (request, response) => {
    // Constants.
    const cms = {
        generalContent: {
            continue: "Continue"
        }
    };
    const data = request.session.data;
    const barredAdults = data["barred-adults"];
    const inputCache = loadPageData(request);
    const renderPath = "registered-body/enhanced/barred-list-adults";
    const workforceSelectedIncludesChildOrOther = data["selected"];

    // Properties.
    let dataValidation = {};
    let redirectPathBarredListChildren = "barred-list-children";
    let redirectPathWorkingAtHomeAddress = "working-at-home-address";

    // Cache session.
    savePageData(request, data);

    /* Validates that the entitlement to know if the applicant is barred from
     * working with adults has been selected. */
    if (!barredAdults) {
        dataValidation["barred-adults"] = "Select if you are entitled to know if the applicant is barred from working with adults";
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cms, cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["barred-adults"] = request.body["barred-adults"];
        if (!workforceSelectedIncludesChildOrOther) {
            redirectPath = persistChangeQueryStringFromRequestForPath(request, redirectPathWorkingAtHomeAddress);
        } else {
            redirectPath = persistChangeQueryStringFromRequestForPath(request, redirectPathBarredListChildren);
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateBarredListAdults = validateBarredListAdults;