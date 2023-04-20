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
    const barredChildren = data["barred-children"];
    const childrenOrAdults = data["children-or-adults"];
    const inputCache = loadPageData(request);
    const redirectPathBarredListChildren = persistChangeQueryStringFromRequestForPath(request, "barred-list-children");
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const redirectPathWorkingAtHomeAddress = persistChangeQueryStringFromRequestForPath(request, "working-at-home-address");
    const renderPath = "registered-body/enhanced/barred-list-adults";
    const workforceSelected = request.session.data["workforce-selected"];

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathBarredListChildren;

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
        if (request.query && request.query.change) {
            if (workforceSelected !== "Adult") {
                /* Applicant is working with children in addition to adults in
                 * the workforce. */ 

                if (barredChildren && childrenOrAdults) {
                    /* Entitlement to know if the applicant is barred from
                     * working with children and whether or not the position
                     * involves working with adults or children at the
                     * applicant's home address has already been captured. */
                    redirectPath = redirectPathCheckAnswers;
                }
            } else {
                // Applicant is only working with adults in the workforce.

                if (childrenOrAdults) {
                    /* If the position involves working with adults or children
                     * at the applicant's home address has already been
                     * captured. */
                    redirectPath = redirectPathCheckAnswers;
                } else {
                    /* Captures if the position involves working with adults or
                     * children at the applicant's home address. */
                    redirectPath = redirectPathWorkingAtHomeAddress;
                }
            }
        } else {
            if (barredChildren) {
                /* Entitlement to know if the applicant is barred from working
                 * with children has already been captured. */
                redirectPath = redirectPathWorkingAtHomeAddress;
            }
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateBarredListAdults = validateBarredListAdults;