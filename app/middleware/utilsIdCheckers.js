// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _PREDEFINED_ID_CHECKERS = [
    {
        name: 'Joe Bloggs',
        email: 'joeb@gmail.com',
        password: 'pass1234',
        mobile: '07666 993355',
        org: 'Burns Construction Co.',
        dept: 'Student Applications',
        dateAdded: '28/03/2023',
    },
    {
        name: 'David Smith',
        email: 'ds@gmail.com',
        password: 'pass1234',
        mobile: '07613 385143',
        org: 'Evening Standard',
        dept: 'Student Applications',
        dateAdded: '14/03/2022',
    },
    {
        name: 'Lisa Walker',
        email: 'lisaw@gmail.com',
        password: 'pass1234',
        mobile: '07837 298457',
        org: 'The Leftorium',
        dept: 'Student Applications',
        dateAdded: '19/02/2023',
    },
    {
        name: 'Paul Knowles',
        email: 'paulk@gmail.com',
        password: 'pass1234',
        mobile: '07159 984654',
        org: 'Worldwide Shipping',
        dept: 'Student Applications',
        dateAdded: '30/03/2023',
    }
];



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
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
exports.setPredefinedIdCheckers = setPredefinedIdCheckers;