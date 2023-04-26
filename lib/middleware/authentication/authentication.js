// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
const config = require("../../../app/config");



// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { getEncryptedPassword } = require("../../../app/middleware/utilsMiddleware");



// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const redirectPathAuthenticate = "/prototype-admin/authenticate";
/* Allows access to the following paths when authentication has not been
 * established for the session. */
const unauthenticatedPaths = [
    "/extension-assets/govuk-frontend/govuk/all.js",
    "/extension-assets/%40ministryofjustice%2Ffrontend/moj/all.js",
    "/govuk/assets/fonts/bold-b542beb274-v2.woff2",
    "/govuk/assets/fonts/light-94a07e06a1-v2.woff2",
    "/govuk/assets/images/govuk-apple-touch-icon-180x180.png",
    "/govuk/assets/images/favicon.ico",
    "/govuk/assets/images/govuk-crest.png",
    "/public/javascripts/application.js",
    "/public/javascripts/auto-store-data.js",
    "/public/javascripts/jquery-3.6.0.min.js",
    "/public/javascripts/polyfill-details-1.2.0.js",
    "/public/javascripts/promise-polyfill-8.1.3.js",
    "/public/javascripts/whatwg-fetch-3.4.0.js",
    "/public/stylesheets/application.css",
    redirectPathAuthenticate
];



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const authentication = () => {
    // Constants.
    const encryptedPassword = getEncryptedPassword();
    const useAuthentication = (config.useAuth === "true");

    // Response.
    return (request, response, next) => {
        if (!useAuthentication) {
            /* Authentication is not to be used for the session. Fulfill
             * response. */
            next();
        } else if (isAuthenticated(request, encryptedPassword)) {
            /* Authentication has been established for the session. Fulfill
             * response. */ 
            next();
        } else if (unauthenticatedPaths.includes(request.path)) {
            // Authentication is not required for the response.
            next();
        } else {
            /* Authentication has not been established. Response prompts for
             * submission of a password to access the prototype. */
            response.redirect(redirectPathAuthenticate);
        }
    };
};

const isAuthenticated = (request, encryptedPassword) => {
    // Determines if authentication has been established for the session.
    return (request.cookies.authentication === encryptedPassword);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
module.exports = authentication;