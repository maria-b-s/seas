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
    const app = request.query.app;
    const redirectPathIdVerified = "id-verified";
    const selectedIdc = request.session.selectedIDC;

    // Properties.
    let redirectPath = `${redirectPathIdVerified}?app=${app}`;

    // Cache session.
    savePageData(request, request.body);

    // Identifies the application that is to have its ID verified.
    if (selectedIdc && data["idc-applications"]) {
        applicationIndex = data["idc-applications"].findIndex(application => application.id == request.query.app);
        request.session.data["idc-applications"][applicationIndex].idChecker = selectedIdc.name;
    }

    // Response.
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateVerifyingId = validateVerifyingId;