// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _PREDEFINED_IDC_APPLICATIONS = [
    {
        id: 0,
        name: "Bob Moore",
        firstName: "Bob",
        middleName: "",
        surname: "Moore",
        prevNames: [],
        dob: "23/08/2000",
        sex: "Male",
        nino: "TY43567T",
        licence: "MOORB45231ERTY",
        passport: "TY985643KJ",
        passportCountry: "United Kingdom",
        nationality: "British",
        addressTown: "Westminster",
        addressCountry: "United Kingdom",
        email: "bobmoore@example.org",
        ref: "MOOR0811",
        date: "21/05/2023",
        organisation: "Cavendish Taxis",
        position: "Driver",
        appType: "New employee",
        type: "Standard",
        workforce: "Adult and Child",
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
        changedAddress: "Yes",
        previous_addresses: [],
        phoneNumber: "06958 345643",
        dateSubmitted: "21/05/2023",
        idChecker: "Unassigned",
        status: "ID check required"
    },
    {
        id: 1,
        name: "Bill Carr",
        firstName: "Bill",
        middleName: "",
        surname: "Carr",
        prevNames: [
            {
                first_name: "Bill",
                middle_names: "",
                last_name: "Bouvier",
                used_from: "06/1975",
                used_to: "01/1980",
            },
            {
                first_name: "Bill",
                middle_names: "",
                last_name: "Bouvier-Hutz",
                used_from: "03/1970",
                used_to: "06/1975",
            }
        ],
        dob: "02/04/1955",
        sex: "Male",
        nino: "AA112201A",
        licence: "CARR9345456MJ7RJ",
        passport: "946890102",
        passportCountry: "United Kingdom",
        nationality: "British",
        addressTown: "Ipswich",
        addressCountry: "United Kingdom",
        email: "billcarr@example.org",
        ref: "CARR0711",
        date: "31/05/2023",
        organisation: "Springfield General Hospital",
        position: "Nurse",
        appType: "New employee",
        type: "Enhanced",
        workforce: "Adult and Child",
        children_or_adults: "No",
        address: [
            {
                lineOne: "10 King Road",
                lineTwo: "Ipswich",
                townOrCity: "Suffolk",
                postcode: "IP24 1QR",
                country: "United Kingdom",
            },
        ],
        changedAddress: "Yes",
        previous_addresses: [
            {
                lineOne: "34 King Edwards Drive",
                lineTwo: "Onchan",
                townOrCity: "Isle of Man",
                postcode: "IM3 2AB",
                country: "United Kingdom",
                startYear: "2021",
                endYear: "2022",
            },
            {
                lineOne: "69 Brownlow Hill",
                lineTwo: "Liverpool",
                townOrCity: "Merseyside",
                postcode: "L17 1SN",
                country: "United Kingdom",
                startYear: "2014",
                endYear: "2021",
            }
        ],
        phoneNumber: "07987 654321",
        dateSubmitted: "31/05/2023",
        idChecker: "Lindsey Naegle",
        status: "ID check required"
    },
    {
        id: 2,
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
        nino: "RE456789K",
        licence: "Not supplied",
        passport: "TY567890LP",
        passportCountry: "United Kingdom",
        nationality: "British",
        addressTown: "Stamford",
        addressCountry: "United Kingdom",
        email: "janerigby@example.org",
        ref: "RIGB0932",
        date: "20/05/23",
        organisation: "Hever Health Care",
        position: "Nurse",
        appType: "New employee",
        type: "Enhanced",
        workforce: "Adult and Child",
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
        changedAddress: "Yes",
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
        dateSubmitted: "20/05/2023",
        idChecker: "Maude Flanders",
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