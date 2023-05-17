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
const postcodeLookupSendAddress = async (request, response) => {
    // Constants.
    const data = request.session.data;
    const inputCache = loadPageData(request);
    const redirectPathSendAddress = persistQueryStringFromRequestForPath(request, "/citizen-application/send-address");
    const regExpPostcode = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/;
    const renderPath = "citizen-application/send-address";
    const sendAddressPostcodeLookup = data["send-address-postcode-lookup"];

    // Properties.
    let dataValidation = {};
    let postcodeAddresses = [];
    let redirectPath = redirectPathSendAddress;

    // Cache session.
    savePageData(request, data);

    // Validates that a valid UK postcode has been submitted for look up.
    if (!sendAddressPostcodeLookup) {
        dataValidation["send-address-postcode-lookup"] = "Enter postcode";
    } else {
        const validSendAddressPostcodeLookup = regExpPostcode.test(sendAddressPostcodeLookup);
        if (!validSendAddressPostcodeLookup) {
            dataValidation["send-address-postcode-lookup"] = "Postcode is not in the correct format"
        } else {
            // Requests addresses for the given postcodes via Ideal Postcodes.
            postcodeAddresses = await getAddressesForPostcode(sendAddressPostcodeLookup);
            if (postcodeAddresses.length === 0) {
                dataValidation["send-address-postcode-lookup"] = "No addresses found for postcode"
            }
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        /* Ideal Postcodes has returned an array of addresses for the given
         * postcode. */
        data["send-address-postcode-addresses"] = postcodeAddresses;
        data["send-address-select"] = getAddressesForSelectComponent(postcodeAddresses, data);
        response.redirect(redirectPath);
    }
};

const manualSendAddress = (request, response) => {
    // Constants.
    const data = request.session.data;
    const redirectPathSendAddress = persistQueryStringFromRequestForPath(request, "/citizen-application/send-address");
    
    // Properties.
    let manualQueryString = "manual=true";
    let redirectPath = redirectPathSendAddress;

    /* Persist any existing query string property for the received HTTP request;
     * "edit" and "address". */
    manualQueryString = redirectPath.includes("?") ? "&" + manualQueryString : "?" + manualQueryString; 
    redirectPath += manualQueryString;

    /* Clears any previously known address, and selected addresses, for a
     * previously submitted postcode. */ 
    data["send-address-line-one"] = "";
    data["send-address-line-two"] = "";
    data["send-address-postcode"] = "";
    data["send-address-postcode-addresses"] = "";
    data["send-address-postcode-lookup"] = "";
    data["send-address-select"] = "";
    data["send-address-select-address"] = "";
    data["send-address-town-or-city"] = "";

    // Response.
    response.redirect(redirectPath);
}



// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------
const getAddressesForSelectComponent = (addresses, data) => {
    // Constants.
    const sendAddressSelect = data["send-address-select"];

    // Properties.
    let isAddressSelected = false;

    // Clears any previously selected address in the select component.
    data["send-address-select-address"] = "";

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
        const addressLinesOneAndTwo = address["line_2"] ? `${ address["line_1"] }, ${ address["line_2"] }` : address["line_1"];
        /* Unique Property Reference Number (UPRN) is a unique identifier for
         * every addressable location in the UK. */
        const addressUprn = address["uprn"];
        isAddressSelected = (addressUprn === sendAddressSelect);
        formattedAddresses.push({
            selected: isAddressSelected,
            text: addressLinesOneAndTwo,
            value: addressUprn
        });
        /* Records any currently selected address in the select component to
         * allow population of the address in corresponding text inputs. */ 
        if (isAddressSelected) {
            data["send-address-line-one"] = address["line_1"];
            data["send-address-line-two"] = address["line_3"] ? address["line_2"] + ", " + address["line_3"] : address["line_2"];
            data["send-address-town-or-city"] = address["post_town"];
            data["send-address-postcode"] = address["postcode"];
            data["send-address-select-address"] = address;
        }
    }
    return formattedAddresses;
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.manualSendAddress = manualSendAddress;
exports.postcodeLookupSendAddress = postcodeLookupSendAddress;