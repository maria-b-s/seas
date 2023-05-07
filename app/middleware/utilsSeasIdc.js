// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _PREDEFINED_IDC_APPLICATIONS = [
    {
        id: 0,
        name: "Bob Moore",
        firstName: "Bob",
        middleName: "Henry",
        surname: "Moore",
        prevNames: [],
        dob: "23/08/2000",
        sex: "Male",
        nino: "TY 43567 T",
        licence: "MOORB 45231 ERTY",
        passport: "TY985643KJ",
        passportCountry: "United Kingdom",
        nationality: "British",
        addressTown: "Westminster",
        addressCountry: "United Kingdom",
        email: "bobmoore@example.org",
        ref: 126659,
        date: "14/04/2023",
        organisation: "Cavendish Taxis",
        position: "Driver",
        appType: "New employee",
        type: "Standard",
        workforce: "Adult and child",
        children_or_adults: "No",
        address: [
            {
                lineOne: "15 Wells Lane",
                lineTwo: "Habberley",
                townOrCity: "Kidderminster",
                postcode: "KD3 7DF",
                country: "United Kingdom",
            },
        ],
        changedAddress: "yes",
        previous_addresses: [],
        phoneNumber: "06958 345643",
        dateSubmitted: "14/04/2023",
        idChecker: "Unassigned",
        status: "ID check required"
    },
    {
        id: 1,
        name: "Jane Rigby",
        firstName: "Jane",
        middleName: "Mary",
        surname: "Rigby",
        prevNames: [
            {
                first_name: "Julie",
                middle_names: "Mary",
                last_name: "Rigby",
                used_from: "06/1997",
                used_to: "01/2011",
            },
            {
                first_name: "Helen",
                middle_names: "Mary",
                last_name: "Jones",
                used_from: "04/1989",
                used_to: "06/1997",
            },
        ],
        dob: "02/05/1990",
        sex: "Female",
        nino: "RE 456789 K",
        licence: "Not supplied",
        passport: "TY567890LP",
        passportCountry: "United Kingdom",
        nationality: "British",
        addressTown: "Stamford",
        addressCountry: "United Kingdom",
        email: "jrigby@example.org",
        ref: 12345,
        date: "20/03/23",
        organisation: "Hever Health Care",
        position: "Nurse",
        appType: "New employee",
        type: "Enhanced",
        workforce: "Adult and child",
        children_or_adults: "Yes",
        address: [
            {
                lineOne: "23 High Street",
                lineTwo: "Billington",
                townOrCity: "Sussex",
                postcode: "SU32 3ER",
                country: "United Kingdom",
            },
        ],
        changedAddress: "yes",
        previous_addresses: [
            {
                lineOne: "3a Wellington Avenue",
                lineTwo: "Billington",
                townOrCity: "Sussex",
                postcode: "SU33 5RT",
                country: "United Kingdom",
                startYear: "2020",
                endYear: "2022",
            },
            {
                lineOne: "76 Minory Close",
                lineTwo: "",
                townOrCity: "Birminham",
                postcode: "BH1 5GB",
                country: "United Kingdom",
                startYear: "2010",
                endYear: "2020",
            },
        ],
        phoneNumber: "07699 334565",
        dateSubmitted: "20/03/2023",
        idChecker: "Mary Berry",
        status: "ID check required"
    }
];



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const setPredefinedIdcApplications = (request) => {
    // Constants.
    const data = request.session.data;

    /* Ensures predefined IDC applications are available for selection within
     * /dashboard. */ 
    data["idc-applications"] = data["idc-applications"] ?? _PREDEFINED_IDC_APPLICATIONS;
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.setPredefinedIdcApplications = setPredefinedIdcApplications;