// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateApplicantEmailAddress = (request, response) => {
    // Constants.
    const data = request.session.data;
    const applicantEmail = data["applicant-email"];
    const applicantEmailConfirm = data["applicant-email-confirm"];
    const inputCache = loadPageData(request);
    const inputCharactersMaximum = 100;
    const redirectPathCheckAnswers = "check-answers";
    const regExpEmailAddress = /^(?!\.)(?!.*\.\.)(?!.*\.$)(?!.*@.*@)[a-zA-Z0-9&'+=_\-\/]([\.a-zA-Z0-9&'+=_\-\/]){0,63}@[a-zA-Z0-9\-]{1,63}(\.([a-zA-Z0-9\-]){1,63}){0,}$/;
    const renderPath = "registered-body/applicant-email";

    // Properties.
    let dataValidation = {};

    // Cache session.
    savePageData(request, data);

    // Validates if the applicant's email address is genuine.
    if (!applicantEmail) {
        dataValidation["applicant-email"] = "Enter email address";
    } else {
        const validApplicantEmail = regExpEmailAddress.test(applicantEmail);
        if (!validApplicantEmail) {
            dataValidation["applicant-email"] = "Enter email address in the correct format";
        } else if (applicantEmail.length > inputCharactersMaximum) {
            dataValidation["applicant-email"] = `Email address must be ${ inputCharactersMaximum } characters or fewer`;
        }
    }
    /* Validates if the applicant's has successfully confirmed their email
     * address. */
    if (!applicantEmailConfirm) {
        dataValidation["applicant-email-confirm"] = "Enter confirm email address";
    } else {
        const validApplicantEmail = regExpEmailAddress.test(applicantEmail);
        const validApplicantEmailConfirm = regExpEmailAddress.test(applicantEmailConfirm);
        if (!validApplicantEmailConfirm) {
            dataValidation["applicant-email-confirm"] = "Enter confirm email address in the correct format";
        } else if (applicantEmailConfirm.length > inputCharactersMaximum) {
            dataValidation["applicant-email-confirm"] = `Confirm email address must be ${ inputCharactersMaximum } characters or fewer`;
        } else if (validApplicantEmail && validApplicantEmailConfirm) {
            if (applicantEmail !== applicantEmailConfirm) {
                dataValidation["applicant-email"] = "Email address and confirm email address do not match";
                dataValidation["applicant-email-confirm"] = " ";
            }
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        request.session.data["applicant-email"] = request.body["applicant-email"];
        response.redirect(redirectPathCheckAnswers);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateApplicantEmailAddress = validateApplicantEmailAddress;