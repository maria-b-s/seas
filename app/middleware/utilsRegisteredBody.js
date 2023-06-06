// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const assignIdCheckOfApplicationToRegisteredBody = (request, response) => {
    // Constants.
    const data = request.session.data;
    const applications = data["applications"];
    const queryApplication = request.query.application;
    const redirectPathHome = "/dashboard/home";
    const registeredBody = request.session.selectedRB;

    // Properties.
    let redirectPath = redirectPathHome;

    // Cache session.
    savePageData(request, data);

    /* Assigns the ID check of an application to the registered body (and not
     * an individual ID Checker) who is currently logged into SEAS. */
    if (applications) {
        const applicationIndex = applications.findIndex(application => application["ref"] === queryApplication);
        if (applicationIndex >= 0) {
            data["applications"][applicationIndex]["idChecker"] = registeredBody["name"]; 
        }
    }

    // Response.
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.assignIdCheckOfApplicationToRegisteredBody = assignIdCheckOfApplicationToRegisteredBody;