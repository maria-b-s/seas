// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdCheckersAdd = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idCheckerDeclare = data["id-checker-declare"];
    const inputCache = loadPageData(request);
    const redirectPathIdCheckersAddName = "id-checkers-add-name";
    const renderPath = "registered-body/id-checkers-add";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathIdCheckersAddName;

    // Cache session.
    savePageData(request, data);

    /* Validates that all checkboxes has been checked for declaring that the
     * Registered Body remains responsible for conducting accurate identity
     * checks. */
    if (!idCheckerDeclare || idCheckerDeclare.length !== 3) {
        dataValidation["id-checker-declare"] = "Tick all boxes to confirm you agree with the declaration";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["id-checker-declare"] = request.body["id-checker-declare"];
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckersAdd = validateIdCheckersAdd;