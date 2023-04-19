// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistChangeQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateBarredListChildren = (request, response) => {
    // Constants.
    const cms = {
        generalContent: {
            continue: "Continue"
        }
    };
    const data = request.session.data;
    const barredChildren = data["barred-children"];
    const inputCache = loadPageData(request);
    const renderPath = "registered-body/enhanced/barred-list-children";

    // Properties.
    let dataValidation = {};
    let redirectPath = "working-at-home-address";

    // Cache session.
    savePageData(request, data);

    /* Validates that the entitlement to know if the applicant is barred from
     * working with children has been selected. */
    if (!barredChildren) {
        dataValidation["barred-children"] = "Select if you are entitled to know if the applicant is barred from working with children";
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cms, cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["barred-children"] = request.body["barred-children"];
        redirectPath = persistChangeQueryStringFromRequestForPath(request, redirectPath);
        response.redirect(redirectPath);
    }
}



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateBarredListChildren = validateBarredListChildren;