// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { persistQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const addClientOrganisation = (request, response) => {
    // Constants.
    const data = request.session.data;

    // Properties.
    let clientOrganisation = data["client-organisation"];
    let redirectPath = "client-organisation-confirmation";

    // Adds the client organisation.
    if (clientOrganisation) {
        // Prevents duplicate client organisations from being added.
        if (!data["client-organisations"].find(eClientOrganisation => eClientOrganisation.text === clientOrganisation)) {
            // Formats the client organisation for use in Select component.
            clientOrganisation = {
                selected: false,
                text: clientOrganisation,
                value: clientOrganisation
            }
            data["client-organisations"].push(clientOrganisation);
            // Ensures client organisations maintain alphanumeric order.
            data["client-organisations"].sort((x, y) => x.text.toLowerCase().localeCompare(y.text.toLowerCase()));
        }
    }
    
    // Cache session.
    savePageData(request, data);

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    redirectPath = persistQueryStringFromRequestForPath(request, redirectPath);
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.addClientOrganisation = addClientOrganisation;