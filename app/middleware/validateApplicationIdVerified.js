// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _APPLICATION_STATUS = [
    { id: "1", text: "ID check required" },
    { id: "2", text: "Ready to submit" },
    { id: "3", text: "Sent to applicant" },
    { id: "4", text: "Submitted to DBS" },
    { id: "5", text: "Cancelled" },
    { id: "6", text: "Rejected" },
    { id: "7", text: "Result issued" },
    { id: "8", text: "Action required" }
];



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateApplicationIdVerified = (request, response) => {
    // Constants.
    const app = request.query.app;
    const data = request.session.data;
    const applications = data["applications"];
    const selectedApplication = data["selectedApplication"];
    const applicationIdVerified = data["application-id-verified"];
    const inputCache = loadPageData(request);
    const redirectPathCannotVerify = "cannot-verify";
    const redirectPathVerifiedIdentity = "verified-identity";
    const renderPath = "registered-body/application-details";

    // Properties.
    let dataValidation = {};
    let redirectPath = `${redirectPathVerifiedIdentity}?app=${app}`;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for whether or not the ID has been
     * verified. */
    if (!applicationIdVerified) {
        dataValidation["application-id-verified"] = "Select whether the applicant’s identity has been verified";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation, selectedApplication: selectedApplication });
    } else {
        if (applicationIdVerified === "Yes") {
            // Applicant's ID has been verified.
            if (applications) {
                // Status of the application is updated to "Ready to submit".
                const applicationIndex = applications.findIndex(application => application["ref"] === app);
                if (applicationIndex >= 0) {
                    data["applications"][applicationIndex]["status"] = _APPLICATION_STATUS[1];
                }
            }
        } else {
            // Applicant's ID cannot be verified.
            redirectPath = `${redirectPathCannotVerify}?app=${app}`;
        }
        request.session.data["application-id-verified"] = "";
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateApplicationIdVerified = validateApplicationIdVerified;