// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _PREDEFINED_CLIENT_ORGANISATIONS = [
    {
        selected: false,
        text: "Globex Corporation",
        value: "Globex Corporation"
    },
    {
        selected: false,
        text: "MoneyBank",
        value: "MoneyBank",
    },
    {
        selected: false,
        text: "Springfield Museum",
        value: "Springfield Museum"
    },
    {
        selected: false,
        text: "The Leftorium",
        value: "The Leftorium",
    }
];



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const deselectClientOrganisation = (request) => {
    // Constants.
    const data = request.session.data;

    /* Deselects the client organisation within the Select component in
     * /organisation-name. */ 
    data["client-organisation"] = "";
    selectClientOrganisation(request);
};

const selectClientOrganisation = (request) => {
    // Constants.
    const data = request.session.data;
    const selectedClientOrganisation = data["client-organisation"];

    /* Selects the client organisation chosen within the Select component within
     * /organisation-name. */ 
    data["client-organisations"].forEach((clientOrganisation) => {
        if (clientOrganisation.text === selectedClientOrganisation) {
            clientOrganisation.selected = true;
        } else {
            // Ensures only one client organisation is ever selected.
            clientOrganisation.selected = false;
        }
    });
};

const setPredefinedClientOrganisations = (request) => {
    // Constants.
    const data = request.session.data;

    /* Ensures predefined client organisations are available for selection when
     * choosing a client organisation within /organisation-name. */
    data["client-organisations"] = data["client-organisations"] ?? _PREDEFINED_CLIENT_ORGANISATIONS;
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.deselectClientOrganisation = deselectClientOrganisation;
exports.selectClientOrganisation = selectClientOrganisation;
exports.setPredefinedClientOrganisations = setPredefinedClientOrganisations;