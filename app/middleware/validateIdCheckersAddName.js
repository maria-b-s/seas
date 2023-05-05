// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateIdCheckersAddName = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idCheckerFirstName = data["id-checker-first-name"];
    const idCheckerLastName = data["id-checker-last-name"];
    const inputCache = loadPageData(request);
    const inputCharactersMaximum = 50;
    const redirectPathIdCheckersAddEmailAddress = "id-checkers-add-email-address";
    const regExpName = /^[a-zA-Z'\- ]+$/;
    const renderPath = "registered-body/id-checkers-add-name";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathIdCheckersAddEmailAddress;

    // Cache session.
    savePageData(request, data);

    // Validates if the ID Checker's first name is genuine.
    if (!idCheckerFirstName) {
        dataValidation["id-checker-first-name"] = "Enter first name";
    } else {
        const validFirstName = regExpName.test(idCheckerFirstName);
        if (!validFirstName) {
            dataValidation["id-checker-first-name"] = "First name must only include letters a to z, hyphens, spaces and apostrophes";
        } else if (idCheckerFirstName.length > inputCharactersMaximum) {
            dataValidation["id-checker-first-name"] = `First name must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }
    // Validates if the ID Checker's last name is genuine.
    if (!idCheckerLastName) {
        dataValidation["id-checker-last-name"] = "Enter last name";
    } else {
        const validLastName = regExpName.test(idCheckerLastName);
        if (!validLastName) {
            dataValidation["id-checker-last-name"] = "Last name must only include letters a to z, hyphens, spaces and apostrophes";
        } else if (idCheckerFirstName.length > inputCharactersMaximum) {
            dataValidation["id-checker-last-name"] = `Last name must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["id-checker-first-name"] = request.body["id-checker-first-name"];
        request.session.data["id-checker-last-name"] = request.body["id-checker-last-name"];
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateIdCheckersAddName = validateIdCheckersAddName;