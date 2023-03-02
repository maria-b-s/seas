const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validatePhone(req, res, _next) {
    const state = trimDataValuesAndRemoveSpaces(req.body);
    savePageData(req, state);
    const inputCache = loadPageData(req);
    let dataValidation = {};
    const validCountry = /^[a-zA-Z'\- ]+$/.test(state['phone-country']);
    const validPhone = /^(?:(0|\+44)\d{9,10})$/.test(state['phone-number']);
    let redirectPath = 'previous-convictions';

    if (req.query && req.query.change) {
        redirectPath = 'review-application';
    }

    if (state['wants-text'] == 'no') {
        req.session.data['phone-number'] = null;
        req.session.data['phone-country'] = null;
        req.session.data['wants-text'] = state['wants-text'];
        res.redirect(redirectPath);
    }

    if (state['wants-text'] == 'yes') {
        if(!validCountry){
          dataValidation['phone-country'] = 'Country your mobile number is registered in must only include letters a to z, hyphens, spaces and apostrophes';
        }
        if (!validPhone) {
            dataValidation['phone-number'] = 'Enter mobile number in the correct format';
        }

        if (!state['phone-number']) {
            dataValidation['phone-number'] = 'Enter mobile number';
        }
        if (!state['phone-country']) {
            dataValidation['phone-country'] = 'Enter country your mobile number is registered in';
        }
    }

    if (!state['wants-text']) {
        dataValidation['wants-text'] = 'Select if we can send you text messages';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/telephone-number', { cache: inputCache, validation: dataValidation });
    } else {
        req.session.data['phone-number'] = state['phone-number'];
        req.session.data['wants-text'] = state['wants-text'];
        res.redirect(redirectPath);
    }
}

exports.validatePhone = validatePhone;
