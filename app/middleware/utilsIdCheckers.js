// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _PREDEFINED_ID_CHECKERS = [
    {
        activated : true,
        dateAdded: "28/03/2023",
        dateLastIdCheck: "",
        dept: "Student Applications",
        email: "jasper.beardly@example.org",
        mobile: "07666 993355",
        name: "Jasper Beardly",
        org: "Burns Construction Co.",
        password: "pass1234"
    },
    {
        activated : true,
        dateAdded: "14/03/2023",
        dateLastIdCheck: "21/03/2023",
        dept: "Student Applications",
        email: "maude.flanders@example.org",
        mobile: "07613 385143",
        name: "Maude Flanders",
        org: "Evening Standard",
        password: "pass1234"
    },
    {
        activated : true,
        dateAdded: "19/02/2023",
        dateLastIdCheck: "29/03/2023",
        dept: "Student Applications",
        email: "lindsey.naegle@example.org",
        mobile: "07837 298457",
        name: "Lindsey Naegle",
        org: "The Leftorium",
        password: "pass1234"
    },
    {
        activated : true,
        dateAdded: "30/03/2023",
        dateLastIdCheck: "",
        dept: "Student Applications",
        email: "martin.prince@example.org",
        mobile: "07159 984654",
        name: "Martin Prince",
        org: "Worldwide Shipping",
        password: "pass1234"
    }
];



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const addNewIdChecker = (request) => {
    // Constants.
    const data = request.session.data;
    const registeredBody = request.session.selectedRB;

    /* Stores the captured details of the new ID checkers submitted by the
     * registered body. */
    data["id-checkers"].unshift({
        activated : false,
        dateAdded: new Date().toLocaleDateString("en-GB"),
        dateLastIdCheck: "",
        dept: "Student Applications",
        email: data["id-checker-email-address"],
        mobile: "07969 420720",
        name: data["id-checker-first-name"] + " " + data["id-checker-last-name"],
        org: registeredBody["organisation"],
        password: ""
    });
};

const setPredefinedIdCheckers = (request) => {
    // Constants.
    const data = request.session.data;

    /* Ensures predefined ID checkers are available for selection within
     * /dashboard. */
    data["id-checkers"] = data["id-checkers"] ?? _PREDEFINED_ID_CHECKERS;
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.addNewIdChecker = addNewIdChecker;
exports.setPredefinedIdCheckers = setPredefinedIdCheckers;