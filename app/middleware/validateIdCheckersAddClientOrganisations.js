// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdCheckersAddClientOrganisations = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idCheckerClientOrganisations = data["id-checker-client-organisations"];
    const idCheckerName = `${ data["id-checker-first-name"] }  ${ data["id-checker-last-name"] }`;
    const inputCache = loadPageData(request);
    const redirectPathIdCheckersAddCheckAnswers = "id-checkers-add-check-answers";
    const registeredBody = request.session.selectedRB;
    const renderPath = "registered-body/id-checkers-add-client-organisations";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathIdCheckersAddCheckAnswers;

    // Cache session.
    savePageData(request, data);

    /* Validates that at least one checkbox has been checked to identify a
     * client organisation/s, other than their corresponding organisation that
     * the Identity Checker will do ID checks for. */
    if (!idCheckerClientOrganisations || idCheckerClientOrganisations.length < 1) {
        dataValidation["id-checker-client-organisations"] = `Tick a box for the client organisations ${ idCheckerName } will be doing ID checks for`;
    } else if (idCheckerClientOrganisations.length === 1 && idCheckerClientOrganisations.includes(registeredBody.organisation)) {
        dataValidation["id-checker-client-organisations"] = `Tick a box other than your organisation for the client organisations ${ idCheckerName } will be doing ID checks for`;
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, registeredBody: registeredBody, validation: dataValidation });
    } else {
        request.session.data["id-checker-client-organisations"] = request.body["id-checker-client-organisations"];
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckersAddClientOrganisations = validateIdCheckersAddClientOrganisations;