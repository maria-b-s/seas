// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
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
const validateCancelApplication = (request, response) => {
    // Constants.
    const app = request.query.app;
    const data = request.session.data;
    const applications = data["applications"];
    const redirectPathApplicationCancelled = "application-cancelled";

    // Properties.
    let redirectPath = `${redirectPathApplicationCancelled}?app=${app}`;

    // Cache session.
    request.session.data["application-id-verified"] = "";
    savePageData(request, request.body);

    // Cancels the applicant's application.
    if (applications) {
        // Status of the application is updated to "Cancelled".
        const applicationIndex = applications.findIndex(application => application["ref"] === app);
        if (applicationIndex >= 0) {
            data["applications"][applicationIndex]["status"] = _APPLICATION_STATUS[4];
        }
    }
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateCancelApplication = validateCancelApplication;