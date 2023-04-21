// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateFreeOfChargeVolunteerDeclaration = (request, response) => {
    // Constants.
    const data = request.session.data;
    const focDeclare = data["foc_declare"];
    const inputCache = loadPageData(request);
    const redirectPathApplicantName = "applicant-name";
    const redirectPathCheckAnswers = "/registered-body/check-answers";
    const renderPath = "registered-body/volunteer-declaration";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathApplicantName;

    // Cache session.
    savePageData(request, data);

    /* Validates that the checkbox is checked for declaring that the post meets
     * the DBS definition of free-of-charge volunteer application. */
    if (!focDeclare) {
        dataValidation["foc_declare"] = "Tick the box to confirm you agree with the declaration";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["foc_declare"] = request.body["foc_declare"];
        if (request.query && request.query.change) {
            redirectPath = redirectPathCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateFreeOfChargeVolunteerDeclaration = validateFreeOfChargeVolunteerDeclaration;