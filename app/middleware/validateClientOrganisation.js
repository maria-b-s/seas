// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistChangeQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateClientOrganisation = (request, response) => {
    // Constants.
    const data = request.session.data;
    const clientOrganisation = data["client-organisation"];
    const inputCache = loadPageData(request);
    const inputCharactersMaximum = 60;
    const redirectPathClientOrganisationCheck = persistChangeQueryStringFromRequestForPath(request, "client-organisation-check");
    const regExpOrganisationName = /^[a-zA-Z0-9- '&.,@]+$/;
    const renderPath = "registered-body/client-organisation-add";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathClientOrganisationCheck;

    // Cache session.
    savePageData(request, data);

    // Validates if a client organisation is genuine.
    if (!clientOrganisation) {
        dataValidation["client-organisation"] = "Enter client organisation name";
    } else {
        const validOrganisationName = regExpOrganisationName.test(clientOrganisation);
        if (!validOrganisationName) {
            dataValidation["client-organisation"] = "Client organisation must only include letters a to z, numbers, ampersands, at signs, full stops, commas, hyphens, space characters, apostrophes";
        } else if (clientOrganisation.length > inputCharactersMaximum) {
            dataValidation["client-organisation"] = `Client organisation name must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["client-organisation"] = request.body["client-organisation"];
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateClientOrganisation = validateClientOrganisation;