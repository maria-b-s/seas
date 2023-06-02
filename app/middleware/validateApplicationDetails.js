// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateApplicationDetails = (request, response) => {
    // Constants.
    const applicationId = request.query.application;
    const data = request.session.data;
    const idVerified = data["id-verified"];
    const redirectPathIdDocuments = "id-documents";

    // Properties.
    let redirectPath = `${redirectPathIdDocuments}?application=${applicationId}`;

    // Cache session.
    savePageData(request, request.body);

    // Response.
    request.session.data["id-verified"] = idVerified;
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateApplicationDetails = validateApplicationDetails;