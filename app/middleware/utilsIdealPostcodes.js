// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
const { checkKeyUsability } = require("@ideal-postcodes/core-node");
const { Client } = require("@ideal-postcodes/core-node");
const { lookupPostcode } = require("@ideal-postcodes/core-node");



// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const addressFilter = ["line_1", "line_2", "line_3", "post_town", "postcode", "uprn"];
const client = new Client({ api_key: process.env.KEY_API_IDEALPOSTCODES });



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const isUsable = async () => {
    // Checks if Ideal Postcodes is available and the API key is valid for use.
    const { available: usable } = await checkKeyUsability({ client: client });
    return usable;
}

const getAddressesForPostcode = async (postcode) => {
    // Constants.
    let addresses = [];

    if (postcode) {
        // Format the submitted postcode for submission to Ideal Postcodes.
        const formattedPostcode = postcode.replace(/\s/g, "").toLowerCase();
        addresses  = await lookupPostcode({
            client: client,
            filter: addressFilter,
            postcode: formattedPostcode
        });
    }
    return addresses;
}
// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.isUsable = isUsable;
exports.getAddressesForPostcode = getAddressesForPostcode;