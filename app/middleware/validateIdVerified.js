// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdVerified = (request, response) => {
    // Constants.
    const data = request.session.data;
    const app = request.query.app;
    const idVerified = data["id-verified"];
    const inputCache = loadPageData(request);
    const redirectPathDeclaration = "declaration";
    const redirectPathNotVerified = "not-verified";
    const renderPath = "seas-idc/id-verified";

    // Properties.
    let dataValidation = {};
    let redirectPath = `${redirectPathDeclaration}?app=${app}`;

    // Cache session.
    savePageData(request, request.body);

    /* Validates if a selection has been made for whether or not the ID has been
     * verified. */
    if (!idVerified) {
        dataValidation["id-verified"] = "Select if the applicant’s ID has been successfully verified";
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
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
exports.validateIdVerified = validateIdVerified;