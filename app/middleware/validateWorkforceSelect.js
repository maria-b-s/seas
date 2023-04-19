// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistChangeQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateWorkforceSelect = (request, response) => {
    // Constants.
    const cms = {
        generalContent: {
            continue: "Continue"
        }
    };
    const data = request.session.data;
    const inputCache = loadPageData(request);
    const redirectPathStandard = "/registered-body/position";
    const renderPath = "registered-body/workforce-select";
    const workforceSelected = data["radio-group-workforce-select"];

    // Properties.
    let dataValidation = {};
    let redirectPathBarredListAdults = persistChangeQueryStringFromRequestForPath(request, "/registered-body/enhanced/barred-list-adults");
    let redirectPathBarredListChildren = persistChangeQueryStringFromRequestForPath(request, "/registered-body/enhanced/barred-list-children");

    // Removes any previously selected that the applicant will be working in.
    data["selected"] = undefined;

    // Cache session.
    savePageData(request, data);

    /* Validates that the workforce the applicant will be working in has been
     * selected. */
    if (!workforceSelected) {
        dataValidation["radio-group-workforce-select"] = "Select which workforce the applicant will be working in";
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath,  { cms, cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["workforce-selected"] = workforceSelected;
        if (request._parsedOriginalUrl.path === "/registered-body/workforce-select") {
            // Standard.
            response.redirect(redirectPathStandard); 
        } else {
            // Enhanced.
            if (workforceSelected === "Adult") {
                // Enhanced / Adult.
                response.redirect(redirectPathBarredListAdults);
            } else if (workforceSelected === "Child") {
                // Enhanced / Child.
                response.redirect(redirectPathBarredListChildren);
            } else {
                /* Enhanced / Adult and Child; or
                 * Enhanced / Other. */
                if (request.query && request.query.change) {
                    redirectPathBarredListAdults += `&selected=${ workforceSelected }`;
                } else {
                    redirectPathBarredListAdults += `?selected=${ workforceSelected }`;
                }
                response.redirect(redirectPathBarredListAdults);
            }
        }
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateWorkforceSelect = validateWorkforceSelect;