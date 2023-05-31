// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateSubmitApplicationDetails = (request, response) => {
    // Constants.
    const data = request.session.data;
    const detailsChecked = data["details-checked"];
    const queryApplication = request.query.application;
    const application = data['applications'].filter(application => application["ref"] == queryApplication);
    const inputCache = loadPageData(request);
    const redirectPathNotChecked = "#";
    const redirectPathSubmitApplicationDeclaration = "submit-application-declaration";
    const renderPath = "registered-body/submit-application-details";

    // Properties.
    let dataValidation = {};
    let redirectPath = `${redirectPathSubmitApplicationDeclaration}?application=${queryApplication}`;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for whether or not the application
     * details have been checked. */
    if (!detailsChecked) {
        dataValidation["details-checked"] = "Select if you have checked the applicant's details";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { application: application, cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["details-checked"] = detailsChecked;
        if (detailsChecked === "No") {
            redirectPath = redirectPathNotChecked;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateSubmitApplicationDetails = validateSubmitApplicationDetails;