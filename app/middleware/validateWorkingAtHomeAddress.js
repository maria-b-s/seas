// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateWorkingAtHomeAddress = (request, response) => {
    // Constants.
    const data = request.session.data;
    const childrenOrAdults = data["children-or-adults"];
    const inputCache = loadPageData(request);
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const redirectPathPosition = "/registered-body/position";
    const renderPath = "registered-body/enhanced/working-at-home-address";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathPosition;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made whether or not the position
     * involves working with adults or children at the applicant"s home
     * address. */
    if (!childrenOrAdults) {
        dataValidation["children-or-adults"] = "Select if the position involves working with children or adults at the applicant’s home address";
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["children-or-adults"] = childrenOrAdults;
        if (request.query && request.query.change) {
            redirectPath = redirectPathCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateWorkingAtHomeAddress = validateWorkingAtHomeAddress;