// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateSeasIdcDeclaration = (request, response) => {
    // Constants.
    const data = request.session.data;
    const confirm = data["confirm"];
    const declare = data["declare"];
    const inputCache = loadPageData(request);
    const redirectPathVerifiedSuccess = "verified-success";
    const renderPath = "seas-idc/declaration";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathVerifiedSuccess;

    // Cache session.
    savePageData(request, data);

    /* Validates that both checkboxes are checked for declaring that the
     * application is complete and true. */
    if (!confirm) {
        dataValidation["confirm"] = "Tick the box to confirm you agree with the declaration";
    }
    if (!declare) {
        dataValidation["declare"] = "Tick the box to confirm you agree with the declaration";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["verified-app"] = data["idc-applications"].filter(app => app.id == request.query.app);
        const filteredIdcApplications = data["idc-applications"].filter(app => app.id != request.query.app);
        request.session.data["idc-applications"] = filteredIdcApplications;
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateSeasIdcDeclaration = validateSeasIdcDeclaration;