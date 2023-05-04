// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdDocuments = (request, response) => {
    // Constants.
    const applicationId = request.query.application;
    const data = request.session.data;
    const application = data["idc-applications"].filter(application => application["id"] == applicationId);
    const idDocuments = data["id-documents"];
    const inputCache = loadPageData(request);
    const redirectPathDeclaration = "declaration";
    const renderPath = "seas-idc/id-documents";

    // Properties.
    let dataValidation = {};
    let redirectPath = `${redirectPathDeclaration}?application=${applicationId}`;

    // Cache session.
    savePageData(request, data);

    /* Validates that a checkbox has been checked for declaring that at least
     * one of the documents set out in DBS Guidance has been seen. */
    if (!idDocuments) {
        dataValidation["id-documents"] = "Tick a box to confirm you have seen at least one document set out in DBS Guidance";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { application: application, cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["id-documents"] = request.body["id-documents"];
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdDocuments = validateIdDocuments;