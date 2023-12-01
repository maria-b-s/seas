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
    { id: "7", text: "Result issued" },
    { id: "8", text: "Action required" }
];
const _APPLICATION_TYPES = ["Standard", "Enhanced", "Enhanced with barred"];
const _PREDEFINED_APPLICATIONS = [
    {
        ref: "04593B27",
        title: "Mrs",
        name: "Ashley Jane Huxley",
        firstName: "Ashley",
        middleName: "Jane",
        surname: "Huxley",
        nameUsedFrom: "From January 2020",
        birthFirstName: "Mary",
        birthMiddleName: "Jane",
        birthLastName: "Smith",
        birthNameUsedFrom: "To January 2000",
        status: _APPLICATION_STATUS[0],
        type: _APPLICATION_TYPES[0],
        date: new Date("2023-05-12").valueOf(),
        readableDate: "12/05/2023",
        email: "ahuxley@companyname.com",
        prevNames: [
            {
                first_name: "Mary",
                middle_names: "Jane",
                last_name: "Harrison",
                used_from: "January 2000",
                used_to: "January 2020",
            }
        ],
        dob: "21/03/1981",
        sex: "Female",
        nino: "BB 34 56 44 G",
        licence: "HUXLE853211AJEWT",
        passport: "822280043",
        passportCountry: "United Kingdom",
        nationality: "United Kingdom",

        addressTown: "Gravesend, Kent, United Kingdom",
        addressCountry: "United Kingdom",
        address: [
            {
                lineOne:  "1 River Bank Street",
                lineTwo: "",
                townOrCity: "Chester",
                postcode: "CH12 2EE",
                country: "United Kingdom",
                from: "From January 2015"
            },
        ],
        changedAddress: "No",
        previous_addresses: [],
        phoneNumber: "07123 456789",
        previousConvictions: "No",
        organisation: "Home Security Trust",
        position: "Cook",
        appType: "New applicant",
        workforce: "Child and adult",
        children_or_adults: "No",
        history: [
            {
                action: "Viewed application details",
                date: "20/04/2023",
                time: "11:14 AM",
                person: "Jasper Beardly",
            },
            {
                action: "Viewed application details",
                date: "19/04/2023",
                time: "2:12 PM",
                person: "Hans Moleman",
            },
            {
                action: "Viewed application details",
                date: "18/04/2023",
                time: "12:05 PM",
                person: "Hans Moleman",
            },
            {
                action: "Applicant completed application form",
                date: "16/04/2023",
                time: "6:44 PM",
                person: "Applicant",
            },
            {
                action: "Sent to applicant",
                date: "10/04/2023",
                time: "10:17 AM",
                person: "Jasper Beardly",
            },
            {
                action: "Started application",
                date: "05/04/2023",
                time: "9:45 AM",
                person: "Jasper Beardly",
            },
        ],
        idChecker: ""
    },
    {
        ref: "04593827",
        title: "Mr",
        name: "Matthew Peter Adler",
        firstName: "Matthew",
        middleName: "Peter",
        surname: "Adler",
        nameUsedFrom: "From March 2000",
        birthFirstName: "Matthew",
        birthMiddleName: "Peter",
        birthLastName: "Adler",
        birthNameUsedFrom: "This name is still used",
        status: _APPLICATION_STATUS[0],
        type: _APPLICATION_TYPES[1],
        date: new Date("2023-06-07").valueOf(),
        readableDate: "07/06/2023",
        email: "mpadler@companyname.com",
        prevNames: [],
        dob: "21/03/2000",
        sex: "Male",
        nino: "RR 34 56 78 G",
        licence: "ADLER221030MP243",
        passport: "533380006",
        passportCountry: "United Kingdom",
        nationality: "United Kingdom",
        addressTown: "Manchester, Greater Manchester, United Kingdom",
        addressCountry: "United Kingdom",
        address: [
            {
                lineOne:  "1 Bank Street",
                lineTwo: "Crescent Way",
                townOrCity: "Manchester",
                postcode: "M18 4BC",
                country: "United Kingdom",
                from: "From October 2020"
            },
        ],
        changedAddress: "Yes",
        previous_addresses: [
            {
                lineOne: "1 High Street",
                lineTwo: "",
                townOrCity: "Liverpool",
                postcode: "L18 9SN",
                country: "United Kingdom",
                startYear: "May 2019",
                endYear: "October 2020",
            },
            {
                lineOne: "8 High Street",
                lineTwo: "",
                townOrCity: "Liverpool",
                postcode: "L18 9SN",
                country: "United Kingdom",
                startYear: "April 2015",
                endYear: "May 2019",
            }
        ],
        phoneNumber: "07123 456789",
        previousConvictions: "No",
        organisation: "Springfield General Hospital",
        position: "Teacher",
        appType: "Volunteer",
        workforce: "Child",
        children_or_adults: "No",
        history: [
            {
                action: "Viewed application details",
                date: "20/04/2023",
                time: "11:14 AM",
                person: "Jasper Beardly",
            },
            {
                action: "Viewed application details",
                date: "19/04/2023",
                time: "2:12 PM",
                person: "Hans Moleman",
            },
            {
                action: "Viewed application details",
                date: "18/04/2023",
                time: "12:05 PM",
                person: "Hans Moleman",
            },
            {
                action: "Applicant completed application form",
                date: "16/04/2023",
                time: "6:44 PM",
                person: "Applicant",
            },
            {
                action: "Sent to applicant",
                date: "10/04/2023",
                time: "10:17 AM",
                person: "Jasper Beardly",
            },
            {
                action: "Started application",
                date: "05/04/2023",
                time: "9:45 AM",
                person: "Jasper Beardly",
            },
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