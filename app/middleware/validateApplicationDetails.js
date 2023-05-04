// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateApplicationDetails = (request, response) => {
    // Constants.
    const applicationId = request.query.application;
    const data = request.session.data;
    const application = data["idc-applications"].filter(application => application["id"] == applicationId);
    const idVerified = data["id-verified"];
    const inputCache = loadPageData(request);
    const redirectPathIdDocuments = "id-documents";
    const redirectPathNotVerified = "#";
    const renderPath = "seas-idc/application-details";

    // Properties.
    let dataValidation = {};
    let redirectPath = `${redirectPathIdDocuments}?application=${applicationId}`;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for whether or not the ID has been
     * verified. */
    if (!idVerified) {
        dataValidation["id-verified"] = "Select if the applicant’s ID has been successfully verified";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { application: application, cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["id-verified"] = idVerified;
        if (idVerified === "No") {
            redirectPath = redirectPathNotVerified;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateApplicationDetails = validateApplicationDetails;