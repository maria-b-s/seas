// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { getAddressesForPostcode } = require('./utilsIdealPostcodes');
const { loadPageData } = require('./utilsMiddleware');
const { persistQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const postcodeLookupUkAddress = async (request, response) => {
    // Constants.
    const data = request.session.data;
    const inputCache = loadPageData(request);
    const redirectPathUkAddress = persistQueryStringFromRequestForPath(request, "/citizen-application/uk-address");
    const regExpPostcode = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/;
    const renderPath = "citizen-application/uk-address";
    const ukAddressPostcodeLookup = data["uk-address-postcode-lookup"];

    // Properties.
    let dataValidation = {};
    let postcodeAddresses = [];
    let redirectPath = redirectPathUkAddress;

    // Cache session.
    savePageData(request, data);

    // Validates that a valid UK postcode has been submitted for look up.
    if (!ukAddressPostcodeLookup) {
        dataValidation["uk-address-postcode-lookup"] = "Enter postcode";
    } else {
        const validUkAddressPostcodeLookup = regExpPostcode.test(ukAddressPostcodeLookup);
        if (!validUkAddressPostcodeLookup) {
            dataValidation["uk-address-postcode-lookup"] = "Postcode is not in the correct format"
        } else {
            // Requests addresses for the given postcodes via Ideal Postcodes.
            postcodeAddresses = await getAddressesForPostcode(ukAddressPostcodeLookup);
            if (postcodeAddresses.length === 0) {
                dataValidation["uk-address-postcode-lookup"] = "No addresses found for postcode"
            }
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        /* Ideal Postcodes has returned an array of addresses for the given
         * postcode. */
        data["uk-address-postcode-addresses"] = postcodeAddresses;
        data["uk-address-select"] = getAddressesForSelectComponent(postcodeAddresses, data);
        response.redirect(redirectPath);
    }
};

const manualUkAddress = (request, response) => {
    // Constants.
    const data = request.session.data;
    const redirectPathUkAddress = persistQueryStringFromRequestForPath(request, "/citizen-application/uk-address");
    
    // Properties.
    let manualQueryString = "manual=true";
    let redirectPath = redirectPathUkAddress;

    /* Persist any existing query string property for the received HTTP request;
     * "edit" and "address". */
    manualQueryString = redirectPath.includes("?") ? "&" + manualQueryString : "?" + manualQueryString; 
    redirectPath += manualQueryString;

    /* Clears any previously known address, and selected addresses, for a
     * previously submitted postcode. */ 
    data["uk-address-line-one"] = "";
    data["uk-address-line-two"] = "";
    data["uk-address-postcode"] = "";
    data["uk-address-postcode-addresses"] = "";
    data["uk-address-postcode-lookup"] = "";
    data["uk-address-select"] = "";
    data["uk-address-select-address"] = "";
    data["uk-address-town-or-city"] = "";

    // Response.
    response.redirect(redirectPath);
}



// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------
const getAddressesForSelectComponent = (addresses, data) => {
    // Constants.
    const ukAddressSelect = data["uk-address-select"];

    // Properties.
    let isAddressSelected = false;

    // Clears any previously selected address in the select component.
    data["uk-address-select-address"] = "";

    /* Ensures "Select your address" is the default option and to inform the
     * user that an address now can be selected. */ 
    const formattedAddresses = [ {
        selected: false,
        text: "",
        value: false
    }];
    for (address of addresses) {
        /* Addresses for select component are composed of address line one and
         * address line two. */
        const addressIndex = addresses.indexOf(address).toString();
        const addressLinesOneAndTwo = address["line_2"] ? `${ address["line_1"] }, ${ address["line_2"] }` : address["line_1"];
        isAddressSelected = (addressIndex === ukAddressSelect);
        formattedAddresses.push({
            selected: isAddressSelected,
            text: addressLinesOneAndTwo,
            value: addressIndex
        });
        /* Records any currently selected address in the select component to
         * allow population of the address in corresponding text inputs. */ 
        if (isAddressSelected) {
            data["uk-address-line-one"] = address["line_1"];
            data["uk-address-line-two"] = address["line_3"] ? address["line_2"] + ", " + address["line_3"] : address["line_2"];
            data["uk-address-town-or-city"] = address["post_town"];
            data["uk-address-postcode"] = address["postcode"];
            data["uk-address-select-address"] = address;
        }
    }
    return formattedAddresses;
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.manualUkAddress = manualUkAddress;
exports.postcodeLookupUkAddress = postcodeLookupUkAddress;