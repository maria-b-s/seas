const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validateNationalInsurance(req, res, _next) {
    const state = trimDataValuesAndRemoveSpaces(req.body);

    savePageData(req, state);
    const inputCache = loadPageData(req);
    let dataValidation = {};
    let redirectPath = 'drivers-licence';
    const validNINO = /^[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\s*\d{2}\s*\d{2}\s*\d{2}\s*[A-D]$/.test(state['referred-nino-input']);

    if (req.query && req.query.change) {
        redirectPath = 'review-application';
    }

    if (state['has-national-insurance-number'] == 'no') {
        req.session.data['has-national-insurance-number'] = state['has-national-insurance-number'];
        req.session.data['referred-nino-input'] = null;
        res.redirect(redirectPath);
    }

    if (state['has-national-insurance-number'] == 'yes') {
        if (!state['referred-nino-input']) {
            console.log(1);
            dataValidation['referred-nino-input'] = 'Enter National Insurance number';
        } else if (state['referred-nino-input'].length != 9) {
            console.log(2);
            dataValidation['referred-nino-input'] = 'National Insurance number must be 9 characters';
        } else if (!validNINO) {
            console.log(3);
            dataValidation['referred-nino-input'] = 'National Insurance number must only include letters a to z and numbers';
        }
    }

    if (!state['has-national-insurance-number']) {
        dataValidation['has-national-insurance-number'] = 'Select if you have a National Insurance number';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/national-insurance-number', { cache: inputCache, validation: dataValidation });
    } else {
        req.session.data['has-national-insurance-number'] = state['has-national-insurance-numberr'];
        req.session.data['referred-nino-input'] = state['referred-nino-input'];
        res.redirect(redirectPath);
    }
}

exports.validateNationalInsurance = validateNationalInsurance;
