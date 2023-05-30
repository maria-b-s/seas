// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { loadPageData } = require('./utilsMiddleware');
const { savePageData } = require('./utilsMiddleware');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const validateSignIn = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idcEmail = data["idc-email"];
    const idcPassword = data["idc-password"];
    const inputCache = loadPageData(request);
    const redirectPathSecurityCodeCheck = "security-code-check";
    const regExpIdcEmail = /^(?!\.)(?!.*\.\.)(?!.*\.$)(?!.*@.*@)[a-zA-Z0-9&'+=_\-\/]([\.a-zA-Z0-9&'+=_\-\/]){0,63}@[a-zA-Z0-9\-]{1,63}(\.([a-zA-Z0-9\-]){1,63}){0,}$/;
    const renderPath = "seas-idc/sign-in";

    // Properties.
    let dataValidation = {};
    let redirectPath = redirectPathSecurityCodeCheck;

    // Cache session.
    savePageData(request, data);

    /* Validates if the account of the IDC is valid and aligns to the email and
     * password provided. */
    if (!idcEmail) {
        dataValidation["idc-email"] = 'Enter email address';
    } else {
        const validIdcEmail = regExpIdcEmail.test(idcEmail);
        if (!validIdcEmail) {
            dataValidation["idc-email"] = "Enter email address in the correct format";
        } else {
            
        }
    }
    if (!idcPassword) {
        dataValidation["idc-password"] = "Enter password";
    }
    if ((idcEmail && idcPassword) && data["id-checkers"]) {
        selectedIdc = data["id-checkers"].find(el => idcEmail === el.email);
        if (!selectedIdc) {
            dataValidation["idc-email"] = "Unable to find your details, please check your email and try again";
        } else {
            if (selectedIdc.password != idcPassword) {
                dataValidation["idc-password"] = 'Password is incorrect';
            } else {
                request.session.selectedIDC = selectedIdc;
            }
        }
    }

    // Response.
    if (Object.keys(dataValidation).length) {
        response.render(renderPath, { cache: inputCache, validation: dataValidation });
    } else {
        response.redirect(redirectPath);
    }
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.validateSignIn = validateSignIn;