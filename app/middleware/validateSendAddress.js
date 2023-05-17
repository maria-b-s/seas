// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateSendAddress = (request, response) => {
    // Constants.
    const data = request.session.data;
    const inputCache = loadPageData(request);
    const redirectPathConfirmCurrentAddress = "confirm-current-address";
    const redirectPathLivedElsewhere = "lived-elsewhere";
    const regExpAddressLine = /^[a-zA-Z0-9- '&.,]+$/;
    const regExpPostcode = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/;
    const regExpTownOrCity = /^[a-zA-Z'\- ]+$/;
    const renderPath = "citizen-application/send-address";
    const sendAddressLineOne = data["send-address-line-one"];
    const sendAddressLineTwo = data["send-address-line-two"];
    const sendAddressPostcode = data["send-address-postcode"];
    const sendAddressTownOrCity = data["send-address-town-or-city"];

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathConfirmCurrentAddress;

    // Cache session.
    savePageData(request, data);

    /* Validates that a complete UK address has been captured regardless of it
     * being looked up an address or through a manual entry. */
    // Send address line one.
    if (!sendAddressLineOne) {
        dataValidation["send-address-line-one"] = "Enter address line 1";
    } else {
        const validSendAddressLineOne = regExpAddressLine.test(sendAddressLineOne);
        if (!validSendAddressLineOne) {
            dataValidation["send-address-line-one"] = "Address line 1 must only include letters a to z, numbers, hyphens, spaces, apostrophes, ampersands, full stops and commas";
        } else if (sendAddressLineOne.length < 2 || sendAddressLineOne.length > 200) {
            dataValidation["send-address-line-one"] = "Address line 1 must be between 2 and 200 characters";
        }
    }
    // Send address line two.
    if (sendAddressLineTwo) {
        const validSendAddressLineTwo = regExpAddressLine.test(sendAddressLineTwo);
        if (!validSendAddressLineTwo) {
            dataValidation["send-address-line-two"] = "Address line 2 must only include letters a to z, numbers, hyphens, spaces, apostrophes, ampersands, full stops and commas";
        } else if (sendAddressLineTwo.length < 2 || sendAddressLineTwo.length > 200) {
            dataValidation["send-address-line-two"] = "Address line 2 must be between 2 and 200 characters";
        }
    }
    // Send address town or city.
    if (!sendAddressTownOrCity) {
        dataValidation["send-address-town-or-city"] = "Enter town or city";
    } else {
        const validSendAddressTownOrCity = regExpTownOrCity.test(sendAddressTownOrCity);
        if (!validSendAddressTownOrCity) {
            dataValidation["send-address-town-or-city"] = "Town or city must only include letters a to z, hyphens, spaces and apostrophes"
        } else if (sendAddressTownOrCity.length < 2 || sendAddressTownOrCity.length > 50) {
            dataValidation["send-address-town-or-city"] = "Town or city must be between 2 and 50 characters";
        }
    }
    // Send address postcode.
    if (!sendAddressPostcode) {
        dataValidation["send-address-postcode"] = "Enter postcode";
    } else {
        const validSendAddressPostcode = regExpPostcode.test(sendAddressPostcode);
        if (!validSendAddressPostcode) {
            dataValidation["send-address-postcode"] = "Postcode is not in the correct format"
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        data["cert-address"] = {
            "lineOne": sendAddressLineOne,
            "lineTwo": sendAddressLineTwo,
            "townOrCity": sendAddressTownOrCity,
            "postcode": sendAddressPostcode,
            "country": "United Kingdom"
        }
        if (request.query.edit) {
            redirectPath = redirectPathLivedElsewhere;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateSendAddress = validateSendAddress;