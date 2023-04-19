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
    const childrenOrAdults = data["children-or-adults"];
    const inputCache = loadPageData(request);
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const redirectPathWorkingAtHomeAddress = persistChangeQueryStringFromRequestForPath(request, "working-at-home-address");
    const renderPath = "registered-body/enhanced/barred-list-children";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathWorkingAtHomeAddress;

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
        if (childrenOrAdults && (request.query && request.query.change)) {
            /* If the position involves working with adults or children at the
             * applicant's home address has already been captured. */
            redirectPath = redirectPathCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateBarredListChildren = validateBarredListChildren;