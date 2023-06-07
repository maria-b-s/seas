// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _APPLICATION_ORGANISATIONS = ["Springfield General Hospital", "Texxon", "Home Security Trust"];
const _APPLICATION_STATUS = [
    { id: "1", text: "ID check required" },
    { id: "2", text: "Ready to submit" },
    { id: "3", text: "Sent to applicant" },
    { id: "4", text: "Submitted to DBS" },
    { id: "5", text: "Cancelled" },
    { id: "6", text: "Rejected" },
    { id: "7", text: "Certificate issued" }, 
];
const _APPLICATION_TYPES = ["Standard", "Enhanced", "Enhanced with barred"];
const _PREDEFINED_APPLICATIONS = [
    {
        ref: "CARR0711",
        name: "Bill Carr",
        firstName: "Bill",
        middleName: "",
        surname: "Carr",
        status: _APPLICATION_STATUS[1],
        type: _APPLICATION_TYPES[1],
        date: new Date("2023-05-31").valueOf(),
        readableDate: "31/05/2023",
        email: "billcarr@example.org",
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
        previousConvictions: "No",
        organisation: "Springfield General Hospital",
        position: "Nurse",
        appType: "New employee",
        workforce: "Adult and Child",
        children_or_adults: "No",
        history: [
            {
                action: "Viewed application details",
                date: "10/06/2022",
                time: "11:14am",
                person: "Waylon Smithers",
            },
            {
                action: "Viewed application details",
                date: "09/06/2022",
                time: "02:12pm",
                person: "Hans Moleman",
            },
            {
                action: "Viewed application details",
                date: "09/06/2022",
                time: "12:05pm",
                person: "Hans Moleman",
            },
            {
                action: "Applicant completed application form",
                date: "08/06/2022",
                time: "06:44pm",
                person: "Applicant",
            },
            {
                action: "Sent to applicant",
                date: "07/06/2022",
                time: "10:17am",
                person: "Waylon Smithers",
            },
            {
                action: "Started application",
                date: "07/06/2022",
                time: "09:45am",
                person: "Waylon Smithers",
            },
        ],
        idChecker: ""
    },
    {
        ref: "HUXL0391",
        name: "Ashley Huxley",
        firstName: "Ashley",
        middleName: "",
        surname: "Huxley",
        status: _APPLICATION_STATUS[0],
        type: _APPLICATION_TYPES[0],
        date: new Date("2023-05-17").valueOf(),
        readableDate: "17/05/2023",
        email: "ashleyhuxley@example.org",
        prevNames: [],
        dob: "28/09/1978",
        sex: "Female",
        nino: "",
        licence: "",
        passport: "",
        passportCountry: "",
        nationality: "",
        addressTown: "",
        addressCountry: "",
        address: [
            {
                lineOne:  "",
                lineTwo: "",
                townOrCity: "",
                postcode: "",
                country: "",
            },
        ],
        changedAddress: "No",
        previous_addresses: [],
        phoneNumber: "07123 456789",
        previousConvictions: "No",
        organisation: "Texxon",
        position: "",
        appType: "",
        workforce: "",
        children_or_adults: "",
        history: [
            {
                person: "Jessica Lovejoy",
            }
        ],
        idChecker: ""
    },
    {
        ref: "LEDG09420",
        name: "Jennifer Ledger",
        firstName: "Jennifer",
        middleName: "",
        surname: "Ledger",
        status: _APPLICATION_STATUS[2],
        type: _APPLICATION_TYPES[2],
        date: new Date("2023-05-15").valueOf(),
        readableDate: "15/05/2023",
        email: "jenniferledger@example.org",
        prevNames: [],
        dob: "19/03/1989",
        sex: "Female",
        nino: "",
        licence: "",
        passport: "",
        passportCountry: "",
        nationality: "",
        addressTown: "",
        addressCountry: "",
        address: [
            {
                lineOne:  "",
                lineTwo: "",
                townOrCity: "",
                postcode: "",
                country: "",
            },
        ],
        changedAddress: "No",
        previous_addresses: [],
        phoneNumber: "07567 891234",
        previousConvictions: "No",
        organisation: "Home Security Trust",
        position: "",
        appType: "",
        workforce: "",
        children_or_adults: "",
        history: [
            {
                person: "Ruth Powers",
            }
        ],
        idChecker: ""
    },
    {
        ref: "HUXL0131",
        name: "Christopher Stoll",
        firstName: "Christopher",
        middleName: "",
        surname: "Stoll",
        status: _APPLICATION_STATUS[3],
        type: _APPLICATION_TYPES[0],
        date: new Date("2023-04-24").valueOf(),
        readableDate: "24/04/2023",
        email: "christopherstoll@example.org",
        prevNames: [],
        dob: "01/01/1970",
        sex: "Male",
        nino: "",
        licence: "",
        passport: "",
        passportCountry: "",
        nationality: "",
        addressTown: "",
        addressCountry: "",
        address: [
            {
                lineOne:  "",
                lineTwo: "",
                townOrCity: "",
                postcode: "",
                country: "",
            },
        ],
        changedAddress: "No",
        previous_addresses: [],
        phoneNumber: "07543 210987",
        previousConvictions: "No",
        organisation: "Springfield General Hospital",
        position: "",
        appType: "",
        workforce: "",
        children_or_adults: "",
        history: [
            {
                person: "Arnie Pye",
            }
        ],
        idChecker: ""
    }
];



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const setAppStatus = (request) => {
    // Constants.
    const data = request.session.data;

    // Stores the status in which an application can be assigned.
    data["appStatus"] = _APPLICATION_STATUS;
}

const setOrganisations = (request) => {
    // Constants.
    const data = request.session.data;

    // Stores the organisations that are available within applications.
    data["organisations"] = _APPLICATION_ORGANISATIONS;
}

const setAppTypes = (request) => {
    // Constants.
    const data = request.session.data;

    // Stores the types that can be associated to an application.
    data["appTypes"] = _APPLICATION_TYPES;
}

const setPredefinedApplications = (request) => {
    // Constants.
    const data = request.session.data;
    const idCheckers = data["id-checkers"];

    /* Ensures predefined applications are available and present within the
     * dashboard. */
    let applications = _PREDEFINED_APPLICATIONS;
    for (let i = 2; i < applications.length; i++) {
        applications[i]["idChecker"] = idCheckers[Math.floor(Math.random() * (idCheckers.length -  1))]["name"];
    }
    data["applications"] = applications;
}



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.setAppStatus = setAppStatus;
exports.setAppTypes = setAppTypes;
exports.setOrganisations = setOrganisations;
exports.setPredefinedApplications = setPredefinedApplications;