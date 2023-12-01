// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



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
const validateDeclaration = (request, response) => {
    // Constants.
    const data = request.session.data;
    const app = data["selectedApplication"][0]["ref"];
    const selectedApplication = data["selectedApplication"];
    const applications = data["applications"];
    const declaration = data["declaration"];
    const inputCache = loadPageData(request);
    const redirectPathApplicationSentToDbs = "application-sent-to-dbs";
    const renderPath = "registered-body/declaration";

    // Properties.
    let dataValidation = {};
    let redirectPath = `${redirectPathApplicationSentToDbs}?app=${app}`;

    // Cache session.
    savePageData(request, data);

    /* Validates that a checkbox has been checked for declaring that the
     * information provided in support of the application is complete . */
    if (!declaration || declaration.length !== 3) {
        dataValidation["declaration"] = "Tick the boxes to confirm you agree with the declarations.";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation, selectedApplication: selectedApplication });
    } else {
        request.session.data["declaration"] = request.body["declaration"];
        if (applications) {
            // Status of the application is updated to "Submitted to DBS".
            const applicationIndex = applications.findIndex(application => application["ref"] === app);
            if (applicationIndex >= 0) {
                data["applications"][applicationIndex]["status"] = _APPLICATION_STATUS[3];
            }
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateDeclaration = validateDeclaration;