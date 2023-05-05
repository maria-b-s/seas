// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _PREDEFINED_CLIENT_ORGANISATIONS = [
    {
        selected: false,
        text: "Air Springfield",
        value: "Air Springfield"
    },
    {
        selected: false,
        text: "Aztec Theater",
        value: "Aztec Theater",
    },
    {
        selected: false,
        text: "Barney's Bowlarama",
        value: "Barney's Bowlarama"
    },
    {
        selected: false,
        text: "Blocko Store",
        value: "Blocko Store",
    },
    {
        selected: false,
        text: "Burns Construction Co.",
        value: "Burns Construction Co.",
    },
    {
        selected: false,
        text: "Coffee House",
        value: "Coffee House",
    },
    {
        selected: false,
        text: "Dentz",
        value: "Dentz",
    },
    {
        selected: false,
        text: "Evening Standard",
        value: "Evening Standard",
    },
    {
        selected: false,
        text: "Globex Corporation",
        value: "Globex Corporation",
    },
    {
        selected: false,
        text: "Grocery Store",
        value: "Grocery Store",
    },
    {
        selected: false,
        text: "Hammock Hut",
        value: "Hammock Hut",
    },
    {
        selected: false,
        text: "Hollywood Hotel",
        value: "Hollywood Hotel",
    },
    {
        selected: false,
        text: "Ice Cream Parlor",
        value: "Ice Cream Parlor",
    },
    {
        selected: false,
        text: "KUDD Radio",
        value: "KUDD Radio",
    },
    {
        selected: false,
        text: "Luigi's",
        value: "Luigi's",
    },
    {
        selected: false,
        text: "Marine World",
        value: "Marine World",
    },
    {
        selected: false,
        text: "Moe's Tavern",
        value: "Moe's Tavern",
    },
    {
        selected: false,
        text: "Noise Land Video Arcade",
        value: "Noise Land Video Arcade",
    },
    {
        selected: false,
        text: "Otto Cab Co.",
        value: "Otto Cab Co.",
    },
    {
        selected: false,
        text: "Planet Springfield",
        value: "Planet Springfield",
    }
    ,
    {
        selected: false,
        text: "Springfield Mall",
        value: "Springfield Mall",
    }
    ,
    {
        selected: false,
        text: "Springfield Retirement Castle",
        value: "Springfield Retirement Castle",
    },
    {
        selected: false,
        text: "The Leftorium",
        value: "The Leftorium",
    },
    {
        selected: false,
        text: "Vine Yogurt",
        value: "Vine Yogurt",
    },
    {
        selected: false,
        text: "Worldwide Shipping",
        value: "Worldwide Shipping",
    },
    {
        selected: false,
        text: "ZiffCorp",
        value: "ZiffCorp",
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