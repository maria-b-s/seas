// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { persistChangeQueryStringFromRequestForPath } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validatePositionName = (request, response) => {
    // Constants.
    const data = request.session.data;
    const inputCache = loadPageData(request);
    const inputCharactersMaximum = 60;
    const positionName = data["position-name"];
    const redirectPathCheckAnswers = "check-answers";
    const redirectPathOrganisationName = persistChangeQueryStringFromRequestForPath(request, "organisation-name");
    const regExpPositionName = /^[a-zA-Z'\- ]+$/;
    const renderPath = "registered-body/position";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathOrganisationName;

    // Cache session.
    savePageData(request, data);

    // Validates if the job or role for the DBS check is genuine.
    if (!positionName) {
        dataValidation["position-name"] = "Enter job or role";
    } else {
        const validPositionName = regExpPositionName.test(positionName);
        if (!validPositionName) {
            dataValidation["position-name"] = "Job or role must only include letters a to z, hyphens, spaces and apostrophes";
        } else if (positionName.length > inputCharactersMaximum) {
            dataValidation["position-name"] = `Job or role must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }

    /* Response. Preserving query string properties from the received HTTP
     * request; if present. */
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["position-name"] = request.body["position-name"];
        if (request.query && request.query.change) {
            redirectPath = redirectPathCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validatePositionName = validatePositionName;