// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateVerifyingId = (request, response) => {
    // Constants.
    const data = request.session.data;
    const application = request.query.application;
    const redirectPathApplicationDetails = "application-details";
    const selectedIdc = request.session.selectedIDC;

    // Properties.
    let redirectPath = `${redirectPathApplicationDetails}?application=${application}`;

    // Cache session.
    savePageData(request, request.body);

    // Identifies the application that is to have its ID verified.
    if (selectedIdc && data["idc-applications"]) {
        applicationIndex = data["idc-applications"].findIndex(application => application.id == request.query.application);
        request.session.data["idc-applications"][applicationIndex].idChecker = selectedIdc.name;
    }

    // Response.
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateVerifyingId = validateVerifyingId;