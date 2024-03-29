// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateSeasIdcDeclaration = (request, response) => {
    // Constants.
    const applicationId = request.query.application;
    const data = request.session.data;
    const application = data["idc-applications"].filter(application => application["id"] == applicationId);
    const declare = data["declare"];
    const inputCache = loadPageData(request);
    const redirectPathVerifiedSuccess = "verified-success";
    const renderPath = "seas-idc/declaration";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathVerifiedSuccess;

    // Cache session.
    savePageData(request, data);

    /* Validates that the checkbox is checked for declaring that the application
     * is complete and true. */
    if (!declare) {
        dataValidation["declare"] = "Tick the box to confirm you agree with the declaration";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["verified-app"] = application;
        const filteredIdcApplications = data["idc-applications"].filter(application => application["id"] != applicationId);
        request.session.data["idc-applications"] = filteredIdcApplications;
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateSeasIdcDeclaration = validateSeasIdcDeclaration;