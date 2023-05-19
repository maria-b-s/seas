// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateUkAddress = (request, response) => {
    // Constants.
    const data = request.session.data;
    const inputCache = loadPageData(request);
    const queryStringLocationUk = "location=uk";
    const redirectPathAddressConfirmLocationUk = persistQueryStringFromRequestForPath(request, "address-confirm");
    const regExpAddressLine = /^[a-zA-Z0-9- '&.,]+$/;
    const regExpPostcode = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/;
    const regExpTownOrCity = /^[a-zA-Z'\- ]+$/;
    const renderPath = "citizen-application/uk-address";
    const ukAddressLineOne = data["uk-address-line-one"];
    const ukAddressLineTwo = data["uk-address-line-two"];
    const ukAddressPostcode = data["uk-address-postcode"];
    const ukAddressTownOrCity = data["uk-address-town-or-city"];

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathAddressConfirmLocationUk;

    // Cache session.
    savePageData(request, data);

    /* Validates that a complete UK address has been captured regardless of it
     * being looked up an address or through a manual entry. */
    // UK address line one.
    if (!ukAddressLineOne) {
        dataValidation["uk-address-line-one"] = "Enter address line 1";
    } else {
        const validUkAddressLineOne = regExpAddressLine.test(ukAddressLineOne);
        if (!validUkAddressLineOne) {
            dataValidation["uk-address-line-one"] = "Address line 1 must only include letters a to z, numbers, hyphens, spaces, apostrophes, ampersands, full stops and commas";
        } else if (ukAddressLineOne.length < 2 || ukAddressLineOne.length > 200) {
            dataValidation["uk-address-line-one"] = "Address line 1 must be between 2 and 200 characters";
        }
    }
    // UK address line two.
    if (ukAddressLineTwo) {
        const validUkAddressLineTwo = regExpAddressLine.test(ukAddressLineTwo);
        if (!validUkAddressLineTwo) {
            dataValidation["uk-address-line-two"] = "Address line 2 must only include letters a to z, numbers, hyphens, spaces, apostrophes, ampersands, full stops and commas";
        } else if (ukAddressLineTwo.length < 2 || ukAddressLineTwo.length > 200) {
            dataValidation["uk-address-line-two"] = "Address line 2 must be between 2 and 200 characters";
        }
    }
    // UK address town or city.
    if (!ukAddressTownOrCity) {
        dataValidation["uk-address-town-or-city"] = "Enter town or city";
    } else {
        const validUkAddressTownOrCity = regExpTownOrCity.test(ukAddressTownOrCity);
        if (!validUkAddressTownOrCity) {
            dataValidation["uk-address-town-or-city"] = "Town or city must only include letters a to z, hyphens, spaces and apostrophes"
        } else if (ukAddressTownOrCity.length < 2 || ukAddressTownOrCity.length > 50) {
            dataValidation["uk-address-town-or-city"] = "Town or city must be between 2 and 50 characters";
        }
    }
    // UK address postcode.
    if (!ukAddressPostcode) {
        dataValidation["uk-address-postcode"] = "Enter postcode";
    } else {
        const validUkAddressPostcode = regExpPostcode.test(ukAddressPostcode);
        if (!validUkAddressPostcode) {
            dataValidation["uk-address-postcode"] = "Postcode is not in the correct format"
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        const type = request.query.manual ? "uk-manual" : "uk";
        if (request.query.address === "previous") {
            data["temp-previous-address"] = {
                "lineOne": ukAddressLineOne,
                "lineTwo": ukAddressLineTwo,
                "townOrCity": ukAddressTownOrCity,
                "postcode": ukAddressPostcode,
                "country": "United Kingdom",
                "type": type
            };
        } else {
            data["current_address"] = {
                "lineOne": ukAddressLineOne,
                "lineTwo": ukAddressLineTwo,
                "townOrCity": ukAddressTownOrCity,
                "postcode": ukAddressPostcode,
                "country": "United Kingdom",
                "type": type
            };
        }
        redirectPath = redirectPath.includes("?") ? redirectPath + "&" + queryStringLocationUk : redirectPath + "?" + queryStringLocationUk; 
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateUkAddress = validateUkAddress;