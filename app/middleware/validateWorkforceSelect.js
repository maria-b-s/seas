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
    const data = request.session.data;
    const barredAdults = data["barred-adults"];
    const barredChildren = data["barred-children"];
    const inputCache = loadPageData(request);
    const redirectPathBarredListAdults = persistChangeQueryStringFromRequestForPath(request, "/registered-body/enhanced/barred-list-adults");
    const redirectPathBarredListChildren = persistChangeQueryStringFromRequestForPath(request, "/registered-body/enhanced/barred-list-children");
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const redirectPathStandard = persistChangeQueryStringFromRequestForPath(request, "/registered-body/position");
    const renderPath = "registered-body/workforce-select";
    const workforceSelected = data["workforce-selected"];

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathBarredListAdults;

    // Cache session.
    savePageData(request, data);

    /* Validates that the workforce the applicant will be working in has been
     * selected. */
    if (!workforceSelected) {
        dataValidation["workforce-selected"] = "Select which workforce the applicant will be working in";
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath,  { cache: inputCache, validation: dataValidation });
    } else {
        if (request._parsedOriginalUrl.path.includes("/registered-body/workforce-select")) {
            // Previously selected standard for DBS check level.
            if (request.query && request.query.change) {
                redirectPath = redirectPathCheckAnswers;
            } else {
                redirectPath = redirectPathStandard;
            }
        } else {
            // Previously selected enhanced for DBS check level.
            switch (workforceSelected) {
                case "Adult":
                    // Applicant working in the adult workforce.

                    /* Removes any irrelevant selection made for the child
                     * barred list check. */
                    data["barred-children"] = undefined;
                    /* The entitlement to know if the applicant is barred from
                     * working with adults is only captured when not known. */ 
                    if (barredAdults && (request.query && request.query.change)) {
                        redirectPath = redirectPathCheckAnswers;
                    } else {
                        data["barred-adults"] = undefined;
                    }
                    break;
                case "Child":
                    // Applicant working in the child workforce.

                    /* Removes any irrelevant selection made for the adult
                     * barred list check. */
                    data["barred-adults"] = undefined;
                    /* The entitlement to know if the applicant is barred from
                     * working with children is only captured when not known. */ 
                    if (barredChildren && (request.query && request.query.change)) {
                        redirectPath = redirectPathCheckAnswers;
                    } else {
                        data["barred-children"] = undefined;
                        redirectPath = redirectPathBarredListChildren;
                    }
                    break;
                case "Adult and Child":
                case "Other":
                    // Applicant working in the adult and child/other workforce.

                    /* The entitlement to know if the applicant is barred from
                     * working with adults and/or children is only captured when
                     * not known. */
                    if (request.query && request.query.change) {
                        if (barredAdults && barredChildren) {
                            redirectPath = redirectPathCheckAnswers;
                        } else if (barredAdults && !barredChildren) {
                            redirectPath = redirectPathBarredListChildren;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateWorkforceSelect = validateWorkforceSelect;