// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateSubmitApplicationDeclaration = (request, response) => {
    // Constants.
    const data = request.session.data;
    const queryApplication = request.query.application;
    const application = data['applications'].filter(application => application["ref"] == queryApplication);
    const declaration = data["declaration"];
    const inputCache = loadPageData(request);
    const redirectPathSubmitApplicationConfirmation = "submit-application-confirmation";
    const renderPath = "registered-body/submit-application-declaration";

    // Properties.
    let dataValidation = {};
    let redirectPath = `${redirectPathSubmitApplicationConfirmation}?application=${queryApplication}`;

    // Cache session.
    savePageData(request, data);

    /* Validates that a checkbox has been checked for declaring that the
     * information provided in support of the application is complete . */
    if (!declaration || declaration.length !== 3) {
        dataValidation["declaration"] = "Tick all boxes to confirm you agree with the declaration.";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { application: application, cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["declaration"] = request.body["declaration"];
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateSubmitApplicationDeclaration = validateSubmitApplicationDeclaration;