// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateApplicantName = (request, response) => {
    // Constants.
    const data = request.session.data;
    const firstName = data["first-name"];
    const inputCache = loadPageData(request);
    const inputCharactersMaximum = 50;
    const lastName = data["last-name"];
    const redirectPathCheckAnswers = "check-answers";
    const redirectPathApplicantEmail = "applicant-email";
    const regExpName = /^[a-zA-Z'\- ]+$/;
    const renderPath = "registered-body/applicant-name";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathApplicantEmail;

    // Cache session.
    savePageData(request, data);

    // Validates if the applicant's first name is genuine.
    if (!firstName) {
        dataValidation["first-name"] = "Enter first name";
    } else {
        const validFirstName = regExpName.test(firstName);
        if (!validFirstName) {
            dataValidation["first-name"] = "First name must only include letters a to z, hyphens, spaces and apostrophes";
        } else if (firstName.length > inputCharactersMaximum) {
            dataValidation["first-name"] = `First name must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }
    // Validates if the applicant's last name is genuine.
    if (!lastName) {
        dataValidation["last-name"] = "Enter last name";
    } else {
        const validLastName = regExpName.test(lastName);
        if (!validLastName) {
            dataValidation["last-name"] = "Last name must only include letters a to z, hyphens, spaces and apostrophes";
        } else if (firstName.length > inputCharactersMaximum) {
            dataValidation["last-name"] = `Last name must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["first-name"] = request.body["first-name"];
        request.session.data["last-name"] = request.body["last-name"];
        if (request.query && request.query.change) {
            redirectPath = redirectPathCheckAnswers;
        }
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateApplicantName = validateApplicantName;