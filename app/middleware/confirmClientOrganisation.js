// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { persistChangeQueryStringFromRequestForPath } = require("./utilsMiddleware");
const { savePageData } = require("./utilsMiddleware");
const { selectClientOrganisation } = require('./utilsClientOrganisation');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const confirmClientOrganisation = (request, response) => {
    // Constants.
    const data = request.session.data;
    const redirectPath = persistChangeQueryStringFromRequestForPath(request, "organisation-name");

    // Cache session.
    savePageData(request, request.body);

    /* Ensures the added client organisation is selected within the Select
     * component in /organisation-name. */
    selectClientOrganisation(request);
    data["organisation-check"] = "client-organisation";

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.confirmClientOrganisation = confirmClientOrganisation;