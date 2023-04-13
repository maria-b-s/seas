// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { persistQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateClientOrganisation = (request, response) => {
    // Constants.
    const data = request.session.data;
    const clientOrganisation = data["client-organisation"];
    const inputCache = loadPageData(request);
    const regExpClientOrganisation = /^\w[\w.\-'#&\s]*$/;
    const renderPath = "registered-body/client-organisation-add";

    // Properties.
    let dataValidation = {};
    let redirectPath = "client-organisation-check";

    // Validates if a client organisation is genuine.
    if (!clientOrganisation) {
        dataValidation["client-organisation"] = "Enter a client organisation name";
    } else {
        const validClientOrganisation = regExpClientOrganisation.test(clientOrganisation);
        if (!validClientOrganisation) {
            dataValidation["client-organisation"] = "Client organisation name must only include letters from A to Z, numbers, spaces, and special characters ' # & - . _";
        } else if (clientOrganisation.length > 60) {
            dataValidation["client-organisation"] = "Client organisation name must be 60 characters or fewer";
        }
    }

    // Cache session.
    savePageData(request, data);

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["client-organisation"] = request.body["client-organisation"];
        redirectPath = persistQueryStringFromRequestForPath(request, redirectPath);
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateClientOrganisation = validateClientOrganisation;