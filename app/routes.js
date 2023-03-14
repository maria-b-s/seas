const express = require('express');
const RandExp = require('randexp');

// Middleware import
const { validateSex } = require('./middleware/validateSex');
const { validateNationalInsurance } = require('./middleware/validateNationalInsurance');
const { validateApplicationDetailsConfirm } = require('./middleware/validateApplicationDetailsConfirm');
const { validateWorkforceSelect } = require('./middleware/validateWorkforceSelect');
const { validateDriversLicence } = require('./middleware/validateDriversLicence');
const { validatePassport } = require('./middleware/validatePassport');
const { validatePhone } = require('./middleware/validatePhone');
const { validateBarred } = require('./middleware/validateBarred');
const { validateEmail } = require('./middleware/validateEmail');
const { cancelApplication } = require('./middleware/cancelApplication');
const { addApplication } = require('./middleware/addApplication');
const { sendApplication } = require('./middleware/sendApplication');
const { resendApplication } = require('./middleware/resendApplication');
const { filterAppList } = require('./middleware/filterAppList');
const { searchFilter } = require('./middleware/searchFilter');
const { getMonth } = require('./middleware/getMonth');
const { invalidateCache, loadPageData, savePageData } = require('./middleware/utilsMiddleware');
const moment = require('moment');
const _ = require('lodash');
const { renderString } = require('nunjucks');
const { validateOrganisation } = require('./middleware/validateOrganisation');
const e = require('express');

const router = express.Router();
const citizenRouter = express.Router();
const registeredBodyRouter = express.Router();
const dashboardRouter = express.Router();

const cms = {
    generalContent: {
        continue: 'Continue',
    },
};

registeredBodyRouter.get('/position', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/position', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/position', (req, res) => {
    const inputCache = loadPageData(req);
    let dataValidation = {};
    const validRole = /^[a-zA-Z'\- ]+$/.test(req.body['position-name']);

    if (!validRole) {
        dataValidation['position-name'] = 'Job or role must only include letters a to z, hyphens, spaces and apostrophes';
    }
    if (req.body['position-name'].length > 60) {
        dataValidation['position-name'] = 'Job or role must be 60 characters or fewer';
    }
    if (!req.body['position-name']) {
        dataValidation['position-name'] = 'Enter job or role';
    }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/position', { cache: inputCache, validation: dataValidation });
    } else {
        if (req.query.change == 'true') {
            res.redirect('check-answers');
        } else {
            res.redirect('organisation-name');
        }
    }
});

registeredBodyRouter.get('/organisation-name', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/organisation-name', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.get('/existing-post-holder', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/existing-post-holder', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/existing-post-holder', (req, res) => {
    const inputCache = loadPageData(req);
    let validation = {};

    if (!req.body['rechecked']) {
        validation['rechecked'] = 'Select if this application is for a recheck';
        res.render('registered-body/existing-post-holder', { cms, cache: inputCache, validation: validation });
    } else {
        if (req.query.change == 'true') {
            res.redirect('check-answers');
        } else {
            res.redirect('applicant-name');
        }
    }
});

registeredBodyRouter.get('/volunteer-declaration', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/volunteer-declaration', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/volunteer-declaration', (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let dataValidation = {};

    if (req.body['foc_declare'] == '_unchecked') {
        dataValidation['foc_declare'] = 'Tick the box to confirm you agree with the declaration';
    }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/volunteer-declaration', { cache: inputCache, validation: dataValidation });
    } else {
        if (req.query.change == 'true') {
            res.redirect('check-answers');
        } else {
            res.redirect('applicant-name');
        }
    }
});

registeredBodyRouter.get('/applicant-or-post-holder', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/applicant-or-post-holder', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/applicant-or-post-holder', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    let validation = {};
    if (!req.body['what-application-type']) {
        validation['what-application-type'] = 'Select what kind of applicant the check is for';
        res.render('registered-body/applicant-or-post-holder', { cms, cache: inputCache, validation: validation });
    } else {
        const applicationType = req.body['what-application-type'];
        res.redirect(
            `${
                applicationType === 'Volunteer'
                    ? `volunteer-declaration`
                    : applicationType === 'New employee'
                    ? 'applicant-name'
                    : 'existing-post-holder'
            }${req.header('referer').includes('change=true') ? '?change=true' : ''}`,
        );
    }
});

registeredBodyRouter.post('/organisation-name', invalidateCache, validateOrganisation);

registeredBodyRouter.post('/select-flow', (req, res) => {
    const applicationType = req.session.data['what-application-type'];
    res.redirect(
        `${
            applicationType === 'Volunteer' ? `volunteer-declaration` : applicationType === 'New employee' ? 'applicant-name' : 'existing-post-holder'
        }${req.header('referer').includes('change=true') ? '?change=true' : ''}`,
    );
});

registeredBodyRouter.get('/workforce-select', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/workforce-select', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/workforce-select', invalidateCache, validateWorkforceSelect);


registeredBodyRouter.get('/enhanced/workforce-select', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/enhanced/workforce-select', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/enhanced/workforce-select', invalidateCache, validateWorkforceSelect);

registeredBodyRouter.get('/enhanced/barred-list-adults', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('registered-body/enhanced/barred-list-adults', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/enhanced/barred-list-adults', invalidateCache, validateBarred);

registeredBodyRouter.get('/enhanced/barred-list-children', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('registered-body/enhanced/barred-list-children', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/enhanced/barred-list-children', invalidateCache, validateBarred);


registeredBodyRouter.get('/enhanced/working-at-home-address', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('registered-body/enhanced/working-at-home-address', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/enhanced/working-at-home-address', (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let validation = null;

    if (!req.body['children-or-adults']) {
        validation = {
            'children-or-adults': 'Select if the position involves working with children or adults at the applicant’s home address',
        };

        res.render('registered-body/enhanced/working-at-home-address', { cms, cache: inputCache, validation: validation });
    } else {
        req.session.data['children-or-adults'] = req.body['children-or-adults'];
        res.redirect('/registered-body/position');
    }
});

registeredBodyRouter.get('/applicant-name', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('registered-body/applicant-name', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/applicant-name', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    let dataValidation = {};
    let redirectPath = 'applicant-email';
    const validFirstName = /^[a-zA-Z'\- ]+$/.test(req.body['first-name']);
    const validLastName = /^[a-zA-Z'\- ]+$/.test(req.body['last-name']);

    if (req.query && req.query.change) {
        redirectPath = 'review-application';
    }

    if (!validFirstName) {
        dataValidation['first-name'] = 'First name must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (!validLastName) {
        dataValidation['last-name'] = 'Last name must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (req.body['first-name'].length > 50) {
        dataValidation['first-name'] = 'First name must be 50 characters or fewer';
    }
    if (req.body['last-name'].length > 50) {
        dataValidation['last-name'] = 'Last name must be 50 characters or fewer';
    }

    if (!req.body['first-name']) {
        dataValidation['first-name'] = 'Enter first name';
    }

    if (!req.body['last-name']) {
        dataValidation['last-name'] = 'Enter last name';
    }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/applicant-name', { cache: inputCache, validation: dataValidation });
    } else {
        req.session.data['first-name'] = req.body['first-name'];
        req.session.data['last-name'] = req.body['last-name'];
        res.redirect(redirectPath);
    }
});

registeredBodyRouter.get('/applicant-email', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('registered-body/applicant-email', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/applicant-email', (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let dataValidation = {};
    let applicantEmail = req.body['applicant-email'];
    let applicantEmailConfirm = req.body['applicant-email-confirm'];
    const validEmail =
        /^(?!\.)(?!.*\.\.)(?!.*\.$)(?!.*@.*@)[a-zA-Z0-9&'+=_\-\/]([\.a-zA-Z0-9&'+=_\-\/]){0,63}@[a-zA-Z0-9\-]{1,63}(\.([a-zA-Z0-9\-]){1,63}){0,}$/.test(
            req.body['applicant-email'],
        );
    const validConfirmEmail =
        /^(?!\.)(?!.*\.\.)(?!.*\.$)(?!.*@.*@)[a-zA-Z0-9&'+=_\-\/]([\.a-zA-Z0-9&'+=_\-\/]){0,63}@[a-zA-Z0-9\-]{1,63}(\.([a-zA-Z0-9\-]){1,63}){0,}$/.test(
            req.body['applicant-email-confirm'],
        );

    let enteredEmail = req.session.data['applications'].filter(value => value.email == applicantEmail);

    if (!validEmail) {
        dataValidation['applicant-email'] = 'Enter email address in the correct format';
    }

    if (!validConfirmEmail) {
        dataValidation['applicant-email-confirm'] = 'Enter email address in the correct format';
    }

    if (applicantEmail.length > 100) {
        dataValidation['applicant-email'] = 'Email address must be 100 characters or fewer';
    }

    if (applicantEmailConfirm.length > 100) {
        dataValidation['applicant-email-confirm'] = 'Email address must be 100 characters or fewer';
    }

    if (applicantEmail == req.session.selectedRB.email) {
        dataValidation['applicant-email'] = 'Cannot enter own email address';
    }

    if (enteredEmail.length > 0) {
        dataValidation['applicant-email-confirm'] = 'This email address is already in use on another application';
    }


    if (!applicantEmail) {
        dataValidation['applicant-email'] = 'Enter email address';
    }

    if (!applicantEmailConfirm) {
        dataValidation['applicant-email-confirm'] = 'Enter email address';
    } else if (applicantEmail != applicantEmailConfirm) {
        dataValidation['applicant-email-confirm'] = 'Email address does not match';
    }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/applicant-email', { cache: inputCache, validation: dataValidation });
    } else {
        res.redirect('check-answers');
    }
});

registeredBodyRouter.get('/view-details', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/view-details', { cms, cache: inputCache, query: req.query.app, selectedApplication: selectedApplication });
});

registeredBodyRouter.get('/resend-application', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/resend-application', { cms, cache: inputCache, query: req.query.app, selectedApplication: selectedApplication });
});

registeredBodyRouter.post('/resend-application', invalidateCache, resendApplication);

registeredBodyRouter.get('/resend-confirm', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/resend-confirm', { cms, cache: inputCache, query: req.query.app, selectedApplication: selectedApplication });
});

registeredBodyRouter.get('/confirm-cancel', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/confirm-cancel', { cms, cache: inputCache, query: req.query.app, selectedApplication: selectedApplication });
});

registeredBodyRouter.post('/confirm-cancel', invalidateCache, cancelApplication);

registeredBodyRouter.get('/application-history', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/application-history', { cms, cache: inputCache, query: req.query.app, selectedApplication: selectedApplication });
});

registeredBodyRouter.get('/application-cancelled', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('registered-body/application-cancelled', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.get('/id-checked', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/id-checked', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/id-checked', invalidateCache, (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let dataValidation = {};
    const validName = /^[a-zA-Z'\- ]+$/.test(req.body['name-of-verifier']);

    if (!req.session.data['verified']) {
        dataValidation['verified'] = 'Select if the applicant’s identity has been successfully verified';
    }

    if (req.session.data['verified'] == 'Yes') {
        if (!validName) {
            dataValidation['name-of-verifier'] = 'Name of evidence checker must only include letters a to z, hyphens, spaces and apostrophes';
        }
        if (req.body['name-of-verifier'].length > 100) {
            dataValidation['name-of-verifier'] = 'Name of evidence checker must be 100 characters or fewer';
        }
        if (!req.body['name-of-verifier']) {
            dataValidation['name-of-verifier'] = 'Enter name of evidence checker';
        }
    }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/id-checked', { cache: inputCache, validation: dataValidation });
    } else {
        if (req.session.data['verified'] == 'No') {
            res.redirect('unsuccessful-verification?app=' + req.session.data.selectedApplication[0].ref);
        } else {
            res.redirect('declaration-registered-person?app=' + req.session.data.selectedApplication[0].ref);
        }
    }
});

registeredBodyRouter.get('/declaration-registered-person', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/declaration-registered-person', { cms, cache: inputCache, validation: null });
});

registeredBodyRouter.post('/declaration-registered-person', invalidateCache, (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let dataValidation = {};

    req.session.data.confirm = null;
    req.session.data.declare = null;
    req.session.data.certify = null;

    req.session.data.confirm = req.body['confirm'];
    req.session.data.declare = req.body['declare'];
    req.session.data.certify = req.body['certify'];

    if (req.session.data.confirm == '_unchecked') {
        dataValidation['confirm'] = 'Tick the box to confirm you agree with the declaration';
    }

    if (req.session.data.declare == '_unchecked') {
        dataValidation['declare'] = 'Tick the box to confirm you agree with the declaration';
    }

    if (req.session.data.certify == '_unchecked') {
        dataValidation['certify'] = 'Tick the box to confirm you agree with the declaration';
    }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/declaration-registered-person', { cache: inputCache, validation: dataValidation });
    } else {
        sendApplication(req, res);
        res.redirect('application-sent?app=' + req.session.data.selectedApplication[0].ref);
    }
});

registeredBodyRouter.get('/unsuccessful-verification', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == req.query.app);

    req.session.data.selectedApplication = selectedApplication;

    res.render('registered-body/unsuccessful-verification', {
        cms,
        cache: inputCache,
        query: req.query.app,
        selectedApplication: selectedApplication,
    });
});

registeredBodyRouter.post('/check-answers', invalidateCache, (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let dataValidation = {};

    if (req.body['declare-check-answers'] == '_unchecked') {
        dataValidation['declare-check-answers'] = 'Tick the box to confirm you agree with the declaration';
    }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/check-answers', { cache: inputCache, validation: dataValidation });
    } else {
        addApplication(req, res);
    }
});


// Mock Application Names
const firstNames = [
    'Kieran',
    'Christopher',
    'Jessica',
    'Daniel',
    'Ashley',
    'Jennifer',
    'Joshua',
    'Amanda',
    'Joseph',
    'Andrew',
    'Ryan',
    'Brandon',
    'Jason',
    'Justin',
    'Sarah',
    'Maria',
    'Kieran',
    'Christopher',
    'Jessica',
    'Ashley',
    'Jennifer',
    'Joshua',
    'Amanda',
    'Joseph',
    'Andrew',
    'Ryan',
    'Brandon',
    'Jason',
    'Justin',
    'Sarah',
    'Maria',
];
const lastNames = [
    'Collymore',
    'Stoll',
    'Verlice',
    'Adler',
    'Huxley',
    'Ledger',
    'Smith',
    'Hayes',
    'Ford',
    'Finnegan',
    'Beckett',
    'Gatlin',
    'Gray',
    'Curran',
    'Crassus',
    'Anderson',
    'Collymore',
    'Stoll',
    'Verlice',
    'Huxley',
    'Ledger',
    'Smith',
    'Hayes',
    'Ford',
    'Finnegan',
    'Beckett',
    'Gatlin',
    'Gray',
    'Curran',
    'Crassus',
    'Anderson',
];

router.post('/dbs-check-answer', (req, res) => {
    const whatDbsCheck = req.session.data['what-dbs-check'];
    if (!whatDbsCheck) {
        validation = {
            'what-dbs-check': 'Select which DBS check you are requesting',
        };

        res.render('registered-body/dbs-check-level', { validation: validation });
    }
    // Check whether the variable matches a condition
    if (whatDbsCheck === 'Standard') return res.redirect('registered-body/workforce-select');
    if (whatDbsCheck === 'Enhanced') return res.redirect('registered-body/enhanced/workforce-select');
    return undefined;
});

router.post('/pay-now-answer', (req, res) => {
    const whatPayment = req.session.data['payment-now'];

    if (whatPayment === 'Pay-now') {
        res.redirect('registered-body/enter-card-details');
    } else {
        res.redirect('registered-body/application-sent');
    }
});

citizenRouter.post('/verify-name', (req, res) => {
    const sessionNames = req.session.data.names || [];
    const otherName = req.session.data['other-full-name'];
    const date = req.session.data['name-use-start'];
    if (otherName && otherName[0] !== '' && otherName[2] !== '' && date !== 'Current') {
        sessionNames.push({
            firstName: otherName[0],
            middleNames: otherName[1],
            lastName: otherName[2],
            dates: `${date[0]}/${date[1]}`,
        });
        req.session.data.names = sessionNames;
        return res.redirect(`other-names${req.header('referer').includes('change=true') ? '?change=true' : ''}`);
    }
    const fullName = req.session.data['full-name'];
    if (fullName && fullName[0] !== '' && fullName[2] !== '' && date === 'Current') {
        return res.redirect('other-names');
    }
    return res.redirect('back');
});

citizenRouter.post('/delete-name', (req, res) => {
    const parsedIndex = parseInt(req.query.index, 10);
    if (req.query.index && typeof parsedIndex === 'number') {
        const sessionNames = [...req.session.data.names] || [];
        sessionNames.splice(parsedIndex - 1, 1);
        req.session.data.names = sessionNames;
        return res.status(200).send('deleted');
    }
    return res.status(500).send('error');
});

citizenRouter.post('/add-address', (req, res) => {
    const { address } = req.session.data;

    const addresses = req.session.data.addresses || [];
    let sendCert = req.session.data.send_cert_address || [];

    if (req.query.certificate == 'true') {
        sendCert = [];
        sendCert.push({
            lineOne: address[0],
            lineTwo: address[1],
            townOrCity: address[2],
            postcode: address[3].replace(/\s/g, ''),
            country: address[4],
            startYear: address[5],
        });

        req.session.data.send_cert_address = sendCert;
        return res.redirect('telephone-number');
    }

    if (req.header('referer').includes('change=true')) {
        addresses.pop();
        addresses.push({
            lineOne: address[0],
            lineTwo: address[1],
            townOrCity: address[2],
            postcode: address[3].replace(/\s/g, ''),
            country: address[4],
            startYear: address[5],
        });

        req.session.data.addresses = addresses;

        return res.redirect('review-application');
    } else {
        addresses.push({
            lineOne: address[0],
            lineTwo: address[1],
            townOrCity: address[2],
            postcode: address[3].replace(/\s/g, ''),
            country: address[4],
            startYear: address[5],
        });

        req.session.data.addresses = addresses;

        return res.redirect('previous-address');
    }
});

citizenRouter.post('/add-previous-address', (req, res) => {
    const { previous_address } = req.session.data;
    const previous_addresses = req.session.data.previous_addresses || [];

    previous_addresses.push({
        lineOne: previous_address[0],
        lineTwo: previous_address[1],
        townOrCity: previous_address[2],
        postcode: previous_address[3].replace(/\s/g, ''),
        country: previous_address[4],
        startYear: previous_address[5],
        endYear: previous_address[6],
    });
    req.session.data.previous_addresses = previous_addresses;
    return res.redirect('previous-address');
});

citizenRouter.get('/remove-address', (req, res) => {
    let oldArray = req.session.data.previous_addresses;

    newArray = oldArray.filter(function (obj) {
        return obj.lineOne !== oldArray[req.query.address - 1].lineOne;
    });

    req.session.data.previous_addresses = newArray;
    res.redirect('previous-address');
});

citizenRouter.post('/add-homeless-or-travelling', (req, res) => {
    const addresses = req.session.data.addresses || [];
    const whyNoAddress = req.session.data['why-no-address'];

    if (req.header('referer').includes('change=true')) {
        addresses.pop();
    }

    addresses.push({
        lineOne: whyNoAddress,
        lineTwo: '',
        townOrCity: whyNoAddress === 'Homeless' ? req.session.data['homeless-town-or-city'] : '',
        county: whyNoAddress === 'Homeless' ? req.session.data['homeless-county'] : req.session.data['travelling-county'],
        postcode: '',
        country: 'United Kingdom',
        startYear: `${req.session.data[whyNoAddress === 'Homeless' ? 'homeless-start' : 'travelling-start']} ${
            whyNoAddress === 'Homeless'
                ? req.session.data['still-homeless'] === 'yes'
                    ? 'Still Homeless'
                    : ''
                : req.session.data['still-travelling']
                ? 'Still Travelling'
                : ''
        }`,
    });

    req.session.data.addresses = addresses;

    if (req.header('referer').includes('change=true')) {
        return res.redirect('review-application');
    } else {
        return res.redirect('previous-address');
    }
});

citizenRouter.post('/add-previous-homeless-or-travelling', (req, res) => {
    const previous_addresses = req.session.data.previous_addresses || [];
    const whyNoAddress = req.session.data['previous-why-no-address'];
    previous_addresses.push({
        lineOne: whyNoAddress,
        lineTwo: '',
        townOrCity: whyNoAddress === 'Homeless' ? req.session.data['previous-homeless-town-or-city'] : '',
        county: whyNoAddress === 'Homeless' ? req.session.data['previous-homeless-county'] : req.session.data['previous-travelling-county'],
        postcode: '',
        country: 'United Kingdom',
        startYear: `${req.session.data[whyNoAddress === 'Homeless' ? 'previous-homeless-start' : 'previous-travelling-start']} ${
            whyNoAddress === 'Homeless'
                ? req.session.data['previous-still-homeless'] === 'yes'
                    ? 'Still Homeless'
                    : ''
                : req.session.data['previous-still-travelling']
                ? 'Still Travelling'
                : ''
        }`,
    });
    req.session.data.previous_addresses = previous_addresses;
    return res.redirect('previous-address');
});

citizenRouter.post('/where-certificate', (req, res) => {
    if (req.session.data['where-to-send-cert'] === 'Current Address') return res.redirect('telephone-number');
    return res.redirect('address-lookup?certificate=true');
});

citizenRouter.get('/current-full-name', invalidateCache, (req, res) => {
    res.render('citizen-application/current-full-name', { cache: req.session.data.fullName, validation: null });
});

citizenRouter.post('/current-full-name', invalidateCache, (req, res, next) => {
    const inputCache = loadPageData(req);
    let dataValidation = {};
    let redirectPath = 'previous-names-q';
    const validFirstName = /^[a-zA-Z'\- ]+$/.test(req.body['current-name-first-name']);
    const validMiddleNames = /^[a-zA-Z'\- ]+$/.test(req.body['current-name-middle-names']);
    const validLastName = /^[a-zA-Z'\- ]+$/.test(req.body['current-name-last-name']);

    if (req.query && req.query.change) {
        redirectPath = 'review-application';
    }

    if (!validFirstName) {
        dataValidation['current-name-first-name'] = 'First name must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (!validLastName) {
        dataValidation['current-name-last-name'] = 'Last name must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (req.body['current-name-first-name'].length > 50) {
        dataValidation['current-name-first-name'] = 'First name must be 50 characters or fewer';
    }

    if (req.body['current-name-last-name'].length > 50) {
        dataValidation['current-name-last-name'] = 'Last name must be 50 characters or fewer';
    }

    if (!req.body['current-name-first-name']) {
        dataValidation['current-name-first-name'] = 'Enter first name';
    }

    if (!req.body['current-name-last-name']) {
        dataValidation['current-name-last-name'] = 'Enter last name';
    }

    if (req.body['current-name-middle-names']) {
        if (!validMiddleNames) {
            dataValidation['current-name-middle-names'] = 'Middle names must only include letters a to z, hyphens, spaces and apostrophes';
        }
        if (req.body['current-name-middle-names'].length > 50) {
            dataValidation['current-name-middle-names'] = 'Middle names must be 50 characters or fewer';
        }
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/current-full-name', { cache: inputCache, validation: dataValidation });
    } else {
        res.redirect(redirectPath);
    }
});

citizenRouter.post('/place-of-birth', invalidateCache, (req, res, next) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    const validCity = /^[a-zA-Z'\- ]+$/.test(req.body['address-town']);
    const validCountry = /^[a-zA-Z'\- ]+$/.test(req.body['address-country']);

    if (!validCity) {
        dataValidation['address-town'] = 'Town or city you were born must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (!validCountry) {
        dataValidation['address-country'] = 'Country you were born must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (!req.body['address-town']) {
        dataValidation['address-town'] = 'Enter town or city you were born';
    }

    if (!req.body['address-country']) {
        dataValidation['address-country'] = 'Enter country you were born';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/place-of-birth', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        if (req.query['change'] == 'true') {
            res.redirect('/citizen-application/review-application');
        } else {
            res.redirect('/citizen-application/send-certificate');
        }
    }
});

citizenRouter.get('/drivers-licence', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('citizen-application/drivers-licence', { cache: inputCache, validation: null });
});

citizenRouter.post('/drivers-licence', invalidateCache, validateDriversLicence);

citizenRouter.get('/passport', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('citizen-application/passport', { cache: inputCache, validation: null });
});

citizenRouter.post('/passport', invalidateCache, validatePassport);

citizenRouter.get('/place-of-birth', invalidateCache, (req, res) => {
    res.render('citizen-application/place-of-birth', { validation: null });
});

citizenRouter.get('/previous-names-q', invalidateCache, (req, res) => {
    if (req.query.change) {
        req.session.fromPrevNamesToReview = true;
    }

    const inputCache = loadPageData(req);
    res.render('citizen-application/previous-names-q', { cache: inputCache, validation: null });
});

citizenRouter.post('/previous-names-q', invalidateCache, (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);

    // To prevent mutability I am creating a new object "data" from the req.body
    const data = { ...req.body };

    let validation = null;

    // Explicit coercion to boolean
    if (data['radio-group-alias-input']) {
        data['radio-group-alias-input'] = Boolean(Number(data['radio-group-alias-input']));
    } else {
        validation = {};
        validation['radio-group-alias-input'] = 'Select if you have been known by any other names';
        res.render('citizen-application/previous-names-q', { cache: inputCache, validation: validation });
    }

    if (data['radio-group-alias-input'] === false) {
        if (req.session.data.prevNames) {
            delete req.session.data.prevNames;
        }
        if (req.session.fromPrevNamesToReview) {
            req.session.fromPrevNamesToReview = false;
            res.redirect('/citizen-application/review-application');
        } else {
            res.redirect('/citizen-application/date-of-birth');
        }
    } else if (data['radio-group-alias-input'] === true) {
        if (req.session.data?.prevNames?.length) {
            res.redirect('/citizen-application/previous-names-list');
        } else {
            res.redirect('/citizen-application/previous-names-form');
        }
    }
});

citizenRouter.get('/previous-names-form', invalidateCache, (req, res) => {
    let inputCache = loadPageData(req);

    if (req.query.edit && req.session) {
        inputCache = {};
        const state = req.session?.data?.prevNames || [];
        if (state && state.length > 0) {
            const seedingItem = state[Number(req.query.edit) - 1];

            const seedingObject = {
                'full-name-middle-names': seedingItem.middle_names,
                'full-name-first-name': seedingItem.first_name,
                'full-name-last-name': seedingItem.last_name,
            };

            if (seedingItem.first_name === 'Not entered') {
                seedingObject['full-name-first-name'] = '';
            }

            if (seedingItem.used_from && seedingItem.used_from !== 'Not entered') {
                const seedingItemDateFrom = seedingItem.used_from.split('/');
                seedingObject['alias-from-MM'] = seedingItemDateFrom[0];
                seedingObject['alias-from-YYYY'] = seedingItemDateFrom[1];
            } else {
                seedingObject['alias-from-MM'] = '';
                seedingObject['alias-from-YYYY'] = '';
            }

            if (seedingItem.used_to && seedingItem.used_to !== 'Not entered') {
                const seedingItemDateTo = seedingItem.used_to.split('/');
                seedingObject['alias-to-MM'] = seedingItemDateTo[0];
                seedingObject['alias-to-YYYY'] = seedingItemDateTo[1];
                seedingObject['radio-group-alias-input'] = '0';
            } else {
                seedingObject['radio-group-alias-input'] = '1';
                seedingObject['alias-to-MM'] = '';
                seedingObject['alias-to-YYYY'] = '';
            }

            inputCache = seedingObject;
        }
    }

    res.render('citizen-application/previous-names-form', { cache: inputCache, validation: null });
});

let mapInput = data => {
    const resultObj = {};

    let notEntered = 'Not entered';

    if (data['full-name-first-name']) {
        resultObj.first_name = data['full-name-first-name'];
    } else {
        resultObj.first_name = notEntered;
    }

    if (data['full-name-middle-names']) {
        resultObj.middle_names = data['full-name-middle-names'];
    } else {
        resultObj.middle_names = '';
    }

    if (data['full-name-last-name']) {
        resultObj.last_name = data['full-name-last-name'];
    } else {
        resultObj.last_name = '';
    }

    if (data['alias-from-MM'] && data['alias-from-YYYY']) {
        resultObj.used_from = `${data['alias-from-MM'].padStart(2, '0')}/${data['alias-from-YYYY']}`;
    } else {
        resultObj.used_from = notEntered;
    }

    if (data['alias-to-MM'] && data['alias-to-YYYY']) {
        resultObj.used_to = `${data['alias-to-MM'].padStart(2, '0')}/${data['alias-to-YYYY']}`;
    } else {
        resultObj.used_to = notEntered;
    }

    if (data['radio-group-alias-input'] === '1') {
        resultObj.used_to = 'Present';
    }

    return resultObj;
};

citizenRouter.post('/previous-names-form', invalidateCache, (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);

    const validFirstName = /^[a-zA-Z'\- ]+$/.test(req.body['full-name-first-name']);
    const validMiddleNames = /^[a-zA-Z'\- ]+$/.test(req.body['full-name-middle-names']);
    const validLastName = /^[a-zA-Z'\- ]+$/.test(req.body['full-name-last-name']);

    const validStartMonth = /^[0-9]+$/.test(req.body['alias-from-MM']);
    const validStartYear = /^[0-9]+$/.test(req.body['alias-from-YYYY']);
    const validEndMonth = /^[0-9]+$/.test(req.body['alias-to-MM']);
    const validEndYear = /^[0-9]+$/.test(req.body['alias-to-YYYY']);
    
    const date = new Date();

    if (req.body['alias-from-MM'] < 1 || req.body['alias-from-MM'] > 12) {
        dataValidation['alias-from-MM'] = 'The month you started using name must be between 1 and 12';
    }

    if (req.body['alias-from-YYYY'] < 1899 || req.body['alias-from-YYYY'] > 2200) {
        dataValidation['alias-from-YYYY'] = 'The year you started using name must be a number between 1900 and less than or equal to 2200';
    }

    if (req.body['alias-from-YYYY'].length != 4) {
        dataValidation['alias-from-YYYY'] = 'Year you started using name must include four numbers';
    }


    if(!validStartMonth){
        dataValidation['alias-from-MM'] = 'Month you started using name must be a number';
    }

    if(!validStartYear){
        dataValidation['alias-from-YYYY'] = 'Year you started using name must be a number';
    }


    if (!req.body['alias-from-MM']) {
        dataValidation['alias-from-MM'] = 'Enter month you started using name';
    }

    if (!req.body['alias-from-YYYY']) {
        dataValidation['alias-from-YYYY'] = 'Enter year you started using name';
    } else {
        const inputtedStartDate = new Date(req.body['alias-from-YYYY'], req.body['alias-from-MM'] - 1);

        if (inputtedStartDate.valueOf() >= date.valueOf()) {
            dataValidation['from'] = 'Date you started using name must be in the past';
        }
    }

    if (req.body['radio-group-alias-input'] == 0) {
        if (req.body['alias-to-MM'] < 1 || req.body['alias-to-MM'] > 12) {
            dataValidation['alias-to-MM'] = 'The month you stopped using name must be between 1 and 12';
        }

        if (req.body['alias-to-YYYY'] < 1899 || req.body['alias-to-YYYY'] > 2200) {
            dataValidation['alias-to-YYYY'] = 'The year you stopped using name must be a number between 1900 and less than or equal to 2200';
        }

        if (req.body['alias-to-YYYY'].length != 4) {
            dataValidation['alias-to-YYYY'] = 'Year you stopped using name must include four numbers';
        }

        if(!validEndMonth){
            dataValidation['alias-to-MM'] = 'Month you stopped using name must be a number';
        }
    
        if(!validEndYear){
            dataValidation['alias-to-YYYY'] = 'Year you stopped using name must be a number';
        }

        if (!req.body['alias-to-MM']) {
            dataValidation['alias-to-MM'] = 'Enter month you stopped using name';
        }

        if (!req.body['alias-to-YYYY']) {
            dataValidation['alias-to-YYYY'] = 'Enter year you stopped using name';
        } else {
            const inputtedStartDate = new Date(req.body['alias-from-YYYY'], req.body['alias-from-MM'] - 1);
            const inputtedEndDate = new Date(req.body['alias-to-YYYY'], req.body['alias-to-MM'] - 1);

            if (inputtedEndDate.valueOf() >= date.valueOf()) {
                dataValidation['to'] = 'Date you stopped using name must be in the past';
            }

            if (inputtedStartDate.valueOf() >= inputtedEndDate.valueOf()) {
                dataValidation['to'] = 'Date you stopped using name must be after start date';
            }
        }
    }

    if (!req.body['radio-group-alias-input']) {
        dataValidation['radio-group-alias-input'] = 'Select if you still use this name';
    }

    if (!validFirstName) {
        dataValidation['full-name-first-name'] = 'First name must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (!validLastName) {
        dataValidation['full-name-last-name'] = 'Last name must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (req.body['full-name-first-name'].length > 50) {
        dataValidation['full-name-first-name'] = 'First name must be 50 characters or fewer';
    }

    if (req.body['full-name-last-name'].length > 50) {
        dataValidation['full-name-last-name'] = 'Last name must be 50 characters or fewer';
    }

    if (!req.body['full-name-first-name']) {
        dataValidation['full-name-first-name'] = 'Enter first name';
    }

    if (!req.body['full-name-last-name']) {
        dataValidation['full-name-last-name'] = 'Enter last name';
    }

    if (req.body['full-name-middle-names']) {
        if (!validMiddleNames) {
            dataValidation['full-name-middle-names'] = 'Middle names must only include letters a to z, hyphens, spaces and apostrophes';
        }
        if (req.body['full-name-middle-names'].length > 50) {
            dataValidation['full-name-middle-names'] = 'Middle names must be 50 characters or fewer';
        }
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/previous-names-form', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        let collection = [];

        if (req.session.data.prevNames) {
            collection = req.session.data.prevNames;
        }

        const item = mapInput(inputCache);
    
        if (req.query.edit && Number.isInteger(Number(req.query.edit)) && collection[Number(req.query.edit) - 1]) {
            collection[Number(req.query.edit) - 1] = item;
        } else if (item['first_name'] !== 'Not entered') {
            collection.push(item);
        }

        req.session.data.prevNames = collection;
        res.redirect('/citizen-application/previous-names-list');
    }
});

citizenRouter.get('/previous-names-list', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    let prevNames = [];

    if (req.session.data.prevNames) {
        prevNames = req.session.data.prevNames;
    }

    if (req.query.item && Number.isInteger(Number(req.query.item)) && prevNames[Number(req.query.item) - 1]) {
        _.pullAt(prevNames, [Number(req.query.item) - 1]);
    }

    req.session.data.prevNames = prevNames;

    res.render('citizen-application/previous-names-list', { list: prevNames, cache: inputCache, validation: null });
});

citizenRouter.post('/previous-names-list', invalidateCache, (req, res, _next) => {
    const data = { ...req.body };

    let validation = null;

    let prevNames = [];

    if (req.session.data.prevNames) {
        prevNames = req.session.data.prevNames;
    }

    if (!data['radio-group-previous-names-input']) {
        validation = { 'radio-group-previous-names-input': ' Select if you need to add another previous name' };
        res.render('citizen-application/previous-names-list', { list: prevNames, cache: null, validation: validation });
    } else if (data['radio-group-previous-names-input']) {
        data['radio-group-previous-names-input'] = Boolean(Number(data['radio-group-previous-names-input']));

        const setNewValueNL = data['radio-group-previous-names-input'] === true;

        if (req.session.cache && req.session.cache['/citizen-application/previous-names-form']) {
            delete req.session.cache['/citizen-application/previous-names-form'];
        }

        if (setNewValueNL) {
            let redirectUrlNL = '/citizen-application/previous-names-form';
            res.redirect(redirectUrlNL);
        } else if (setNewValueNL === false) {
            if (req.session.fromPrevNamesToReview) {
                req.session.fromPrevNamesToReview = false;
                res.redirect('/citizen-application/review-application');
            } else {
                res.redirect('/citizen-application/date-of-birth');
            }
        }
    }
});

citizenRouter.get('/date-of-birth', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/date-of-birth', { cache: inputCache, validation: null });
});

citizenRouter.post('/date-of-birth', invalidateCache, (req, res, next) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    const date = new Date();
    const validDay = /^[0-9]+$/.test(req.body['ca-dob-day']);
    const validMonth = /^[0-9]+$/.test(req.body['ca-dob-month']);
    const validYear = /^[0-9]+$/.test(req.body['ca-dob-year']);

    if (req.body['ca-dob-day'] < 1 || req.body['ca-dob-day'] > 31) {
        dataValidation['ca-dob-day'] = 'The day of date of birth must be between 1 and 31';
    }

    if (req.body['ca-dob-month'] < 1 || req.body['ca-dob-month'] > 12) {
        dataValidation['ca-dob-month'] = 'The month of date of birth must be between 1 and 12';
    }

    if (req.body['ca-dob-year'] < 1899 || req.body['ca-dob-year'] > 2200) {
        dataValidation['ca-dob-year'] = 'The year of date of birth must be a number between 1900 and less than or equal to 2200';
    }

    if (req.body['ca-dob-year'].length != 4) {
        dataValidation['ca-dob-year'] = 'Year must include four numbers';
    }

    if(!validDay){
        dataValidation['ca-dob-day'] = 'Day of birth must be a number';
    }
    if(!validMonth){
        dataValidation['ca-dob-month'] = 'Month of birth must be a number';
    }

    if(!validYear){
        dataValidation['ca-dob-year'] = 'Year of birth must be a number';
    }


    if (!req.body['ca-dob-day']) {
        dataValidation['ca-dob-day'] = 'Date of birth must include a day';
    }

    if (!req.body['ca-dob-month']) {
        dataValidation['ca-dob-month'] = 'Date of birth must include a month';
    }

    if (!req.body['ca-dob-year']) {
        dataValidation['ca-dob-year'] = 'Date of birth must include a year';
    } else {
        const inputtedDate = new Date(req.body['ca-dob-year'], req.body['ca-dob-month'] - 1, req.body['ca-dob-day']);
        if (inputtedDate.valueOf() >= date.valueOf()) {
            if (inputtedDate.getFullYear() > date.getFullYear()) {
                dataValidation['ca-dob-year'] = 'Year of birth must be in the past';
            } else if (inputtedDate.getMonth() > date.getMonth()) {
                dataValidation['ca-dob-month'] = 'Month of birth must be in the past';
            } else if (inputtedDate.getDate() > date.getDate()) {
                dataValidation['ca-dob-day'] = 'Day of birth must be in the past';
            }
        } else {
            var diff_ms = date - inputtedDate.getTime();
            var age_dt = new Date(diff_ms);
            var age = Math.abs(age_dt.getUTCFullYear() - 1970);
            if (age < 16) {
                dataValidation['ca-dob-day'] = 'You must be 16 years or older to use this service';
            }
        }
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/date-of-birth', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        if (req.query.change == 'true') {
            return res.redirect('review-application');
        } else {
            return res.redirect('sex');
        }
    }
});

citizenRouter.get('/sex', invalidateCache, (req, res) => {
    let prevValues = null;

    if (req.session.data.sex) {
        prevValues = { sex: req.session.data.sex };
    }

    res.render('citizen-application/sex', { cache: prevValues, validation: null });
});

citizenRouter.post('/sex', invalidateCache, validateSex);

citizenRouter.get('/national-insurance-number', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/national-insurance-number', { cache: inputCache, validation: null });
});

citizenRouter.post('/national-insurance-number', invalidateCache, validateNationalInsurance);

citizenRouter.get('/national-insurance-number', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/telephone-numberr', { cache: inputCache, validation: null });
});

citizenRouter.get('/email-address', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/email-address', { cache: inputCache, validation: null });
});

citizenRouter.post('/email-address', invalidateCache, validateEmail);

citizenRouter.post('/telephone-number', invalidateCache, validatePhone);

citizenRouter.post('/old-or-new', (req, res) => {
    if (req.session.data['existing-app'] === 'new') {
        return res.redirect('current-full-name');
    }
    return res.redirect('sex');
});

citizenRouter.post('/address-lookup', invalidateCache, (req, res, next) => {
    const inputCache = loadPageData(req);
    if (req.query.certificate == 'true') {
        return res.redirect('address-details?certificate=true');
    }

    if (req.query.change == 'true') {
        return res.redirect('address-details?change=true');
    } else {
        return res.redirect('address-details');
    }
});

citizenRouter.post('/previous-address-lookup', invalidateCache, (req, res, next) => {
    const inputCache = loadPageData(req);

    return res.redirect('previous-address-details');
});

citizenRouter.get('/send-certificate', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/send-certificate', { cache: inputCache, validation: null });
});

citizenRouter.post('/send-certificate', (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);

    if (!req.body['postcode-lookup']) {
        dataValidation['postcode-lookup'] = 'Enter postcode';
    }

    if (!req.body['lookup-addr']) {
        dataValidation['lookup-addr'] = 'Select address';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/send-certificate', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        req.session.cache[req.originalUrl.split('?')[0]] = {};
        req.session.data.temp_current = req.body;
        return res.redirect('confirm-current-address');
    }
});

citizenRouter.get('/cert-address-manual', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/cert-address-manual', { cache: inputCache, validation: null });
});

citizenRouter.post('/cert-address-manual', (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    const validAddressLine1 = /^[a-zA-Z0-9- '&.,]+$/.test(req.body['lookup-addr']); //A2
    const validCity = /^[a-zA-Z'\- ]+$/.test(req.body['hidden-details-town']); //A1
    const validPostcode = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(req.body['postcode-lookup']);

    if (!validAddressLine1) {
        dataValidation['lookup-addr'] =
            'Address line 1 must only include letters a to z, numbers, hyphens, spaces, apostrophes, ampersands, full stops and commas';
    }

    if (!validCity) {
        dataValidation['hidden-details-town'] = 'Town or city must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (!validPostcode) {
        dataValidation['postcode-lookup'] = 'UK postcode is not in the correct format. Please check and try again';
    }

    if (req.body['lookup-addr'].length < 2 || req.body['lookup-addr'].length > 200) {
        dataValidation['lookup-addr'] = 'Address line 1 must be between 2 and 200 characters';
    }

    if (req.body['hidden-details-town'].length < 2 || req.body['hidden-details-town'].length > 50) {
        dataValidation['hidden-details-town'] = 'Town or city must be between 2 and 50 characters';
    }

    if (!req.body['lookup-addr']) {
        dataValidation['lookup-addr'] = 'Enter address line 1';
    }

    if (!req.body['hidden-details-town']) {
        dataValidation['hidden-details-town'] = 'Enter town or city';
    }

    if (!req.body['postcode-lookup']) {
        dataValidation['postcode-lookup'] = 'Enter postcode';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/cert-address-manual', {
            cache: inputCache,
            validation: dataValidation,
            query: req.query,
        });
    } else {
        req.session.cache[req.originalUrl.split('?')[0]] = {};
        req.session.data.temp_current = req.body;
        return res.redirect('confirm-current-address');
    }
});

citizenRouter.get('/confirm-current-address', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('citizen-application/confirm-current-address', { cache: inputCache, validation: null, address: req.session.data.temp_current });
});

citizenRouter.post('/confirm-current-address', (req, res) => {
    let dataValidation = {};

    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    const date = new Date();

    if (!req.body['confirm-current-address']) {
        dataValidation['confirm-current'] = 'Select if this is your current address';
    }

    if (req.body['confirm-current-address'] == 'Yes') {
        if (req.body['start-month'] < 1 || req.body['start-month'] > 12) {
            dataValidation['start-month'] = 'The month you started living at this address must be a number between 1 and 12';
        }
        if (req.body['start-year'] < 1899 || req.body['start-year'] > 2200) {
            dataValidation['start-year'] = 'The year you started living at this address must be a number between 1900 and 2200';
        }

        if (req.body['start-year'].length != 4) {
            dataValidation['start-year'] = 'Year you started living at this address must include four numbers';
        }
        if (!req.body['start-month']) {
            dataValidation['start-month'] = 'Enter month you started living at this address';
        }
        if (!req.body['start-year']) {
            dataValidation['start-year'] = 'Enter year you started living at this address';
        } else {
            const inputtedDate = new Date(req.body['start-year'], req.body['start-month'] - 1);

            if (inputtedDate.toLocaleDateString() >= date.toLocaleDateString()) {
                if (inputtedDate.getFullYear() > date.getFullYear()) {
                    dataValidation['start-year'] = 'Year you started living at this address must be in the past';
                } else if (inputtedDate.getMonth() > date.getMonth()) {
                    dataValidation['start-month'] = 'Month you started living at this address must be in the past';
                }
            }
        }
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/confirm-current-address', {
            cache: inputCache,
            validation: dataValidation,
            address: req.session.data.temp_current,
        });
    } else {
        req.session.data['cert-address'] = {};
        req.session.data['cert-address']['lineOne'] = req.session.data.temp_current['lookup-addr'];
        req.session.data['cert-address']['townOrCity'] = req.session.data.temp_current['hidden-details-town'];
        req.session.data['cert-address']['country'] = req.session.data.temp_current['hidden-details-country'];
        req.session.data['cert-address']['postcode'] = req.session.data.temp_current['postcode-lookup'];
        req.session.data['cert-address']['start-month'] = getMonth(req.body['start-month']);
        req.session.data['cert-address']['start-year'] = req.body['start-year'];

        req.session.cache[req.originalUrl.split('?')[0]] = {};

        if (req.body['confirm-current-address'] == 'Yes') {
            req.session.data['isCurrentAddress'] = true;
            req.session.data.current_address = req.session.data['cert-address'];

            const current_addresses = req.session.data.current_addresses || [];
            current_addresses.push(req.session.data['cert-address']);
            req.session.data.current_addresses = current_addresses;

            res.redirect('lived-elsewhere');
        } else {
            res.redirect('living-location?address=current');
        }
    }
});

citizenRouter.get('/living-location', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    res.render('citizen-application/living-location', {
        cache: inputCache,
        validation: null,
        query: req.query,
        hasCurrent: req.session.data.current_address,
    });
});

citizenRouter.post('/living-location', (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let parameterString = '';
    if (req.query.address) {
        parameterString = '?address=' + req.query.address;
    }

    if (!req.body['location']) {
        if (req.query.address == 'current') {
            dataValidation['location'] = 'Select where you live';
        } else {
            dataValidation['location'] = 'Select where you lived';
        }
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/living-location', {
            cache: inputCache,
            validation: dataValidation,
            query: req.query,
        });
    } else {
        if (req.body['location'] == 'UK') {
            res.redirect('uk-address' + parameterString);
        }
        if (req.body['location'] == 'OutsideUK') {
            res.redirect('outside-uk' + parameterString);
        }
        if (req.body['location'] == 'BFPO') {
            res.redirect('bfpo' + parameterString);
        }
        if (req.body['location'] == 'HT') {
            res.redirect('no-address' + parameterString);
        }
    }
});


citizenRouter.get('/uk-address', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/uk-address', { cache: inputCache, validation: null, query: req.query });
});

citizenRouter.post('/uk-address', (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let parameterString = '';
    if (req.query.address) {
        parameterString = '&address=' + req.query.address;
    }

    if (!req.body['postcode-lookup']) {
        dataValidation['postcode-lookup'] = 'Enter postcode';
    }

    if (!req.body['lookup-addr']) {
        dataValidation['lookup-addr'] = 'Select address';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/uk-address', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        if (req.query.address == 'previous') {
            req.session.data['temp-previous-address'] = {};
            req.session.data['temp-previous-address']['lineOne'] = req.body['lookup-addr'];
            req.session.data['temp-previous-address']['townOrCity'] = req.body['hidden-details-town'];
            req.session.data['temp-previous-address']['country'] = req.body['hidden-details-country'];
            req.session.data['temp-previous-address']['postcode'] = req.body['postcode-lookup'];
        } else {
            req.session.data.current_address = {};
            req.session.data.current_address['lineOne'] = req.body['lookup-addr'];
            req.session.data.current_address['townOrCity'] = req.body['hidden-details-town'];
            req.session.data.current_address['country'] = req.body['hidden-details-country'];
            req.session.data.current_address['postcode'] = req.body['postcode-lookup'];
        }

        req.session.cache[req.originalUrl.split('?')[0]] = {};
        return res.redirect('address-confirm?location=uk' + parameterString);
    }
});

citizenRouter.get('/uk-address-manual', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/uk-address-manual', { cache: inputCache, validation: null, query: req.query });
});

citizenRouter.post('/uk-address-manual', (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    const validAddressLine1 = /^[a-zA-Z0-9- '&.,]+$/.test(req.body['lookup-addr']); //A2
    const validCity = /^[a-zA-Z'\- ]+$/.test(req.body['hidden-details-town']); //A1
    const validPostcode = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(req.body['postcode-lookup']);

    let parameterString = '';
    if (req.query.address) {
        parameterString = '&address=' + req.query.address;
    }

    if (!validAddressLine1) {
        dataValidation['lookup-addr'] =
            'Address line 1 must only include letters a to z, numbers, hyphens, spaces, apostrophes, ampersands, full stops and commas';
    }

    if (!validCity) {
        dataValidation['hidden-details-town'] = 'Town or city must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (!validPostcode) {
        dataValidation['postcode-lookup'] = 'UK postcode is not in the correct format. Please check and try again';
    }

    if (req.body['lookup-addr'].length < 2 || req.body['lookup-addr'].length > 200) {
        dataValidation['lookup-addr'] = 'Address line 1 must be between 2 and 200 characters';
    }

    if (req.body['hidden-details-town'].length < 2 || req.body['hidden-details-town'].length > 50) {
        dataValidation['hidden-details-town'] = 'Town or city must be between 2 and 50 characters';
    }

    if (!req.body['lookup-addr']) {
        dataValidation['lookup-addr'] = 'Enter address line 1';
    }

    if (!req.body['hidden-details-town']) {
        dataValidation['hidden-details-town'] = 'Enter town or city';
    }

    if (!req.body['postcode-lookup']) {
        dataValidation['postcode-lookup'] = 'Enter postcode';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/uk-address-manual', {
            cache: inputCache,
            validation: dataValidation,
            query: req.query,
        });
    } else {
        if (req.query.address == 'previous') {
            req.session.data['temp-previous-address'] = {};
            req.session.data['temp-previous-address']['lineOne'] = req.body['lookup-addr'];
            req.session.data['temp-previous-address']['lineTwo'] = req.body['lookup-addr-2'];
            req.session.data['temp-previous-address']['townOrCity'] = req.body['hidden-details-town'];
            req.session.data['temp-previous-address']['country'] = req.body['hidden-details-country'];
            req.session.data['temp-previous-address']['postcode'] = req.body['postcode-lookup'];
        } else {
            req.session.data.current_address = {};
            req.session.data.current_address['lineOne'] = req.body['lookup-addr'];
            req.session.data.current_address['lineTwo'] = req.body['lookup-addr-2'];
            req.session.data.current_address['townOrCity'] = req.body['hidden-details-town'];
            req.session.data.current_address['country'] = req.body['hidden-details-country'];
            req.session.data.current_address['postcode'] = req.body['postcode-lookup'];
        }

        req.session.cache[req.originalUrl.split('?')[0]] = {};
        return res.redirect('address-confirm?location=uk' + parameterString);
    }
});

// Screen 12.013
citizenRouter.get('/address-confirm', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    if (req.query.address == 'previous') {
        res.render('citizen-application/address-confirm', {
            cache: inputCache,
            validation: null,
            address: req.session.data['temp-previous-address'],
            query: req.query,
        });
    } else {
        res.render('citizen-application/address-confirm', {
            cache: inputCache,
            validation: null,
            address: req.session.data.current_address,
            query: req.query,
        });
    }
});

citizenRouter.post('/address-confirm', (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    const validStartMonth = /^[0-9]+$/.test(req.body['start-month']);
    const validStartYear = /^[0-9]+$/.test(req.body['start-year']);
    const validEndMonth = /^[0-9]+$/.test(req.body['end-month']);
    const validEndYear = /^[0-9]+$/.test(req.body['end-year']);
    const date = new Date();

    if (req.body['start-month'] < 1 || req.body['start-month'] > 12) {
        dataValidation['start-month'] = 'The month you started living at this address must be a number between 1 and 12';
    }
    if (req.body['start-year'] < 1899 || req.body['start-year'] > 2200) {
        dataValidation['start-year'] = 'The year you started living at this address must be a number between 1900 and 2200';
    }

    if (req.body['start-year'].length != 4) {
        dataValidation['start-year'] = 'Year you started living at this address must include four numbers';
    }

    if(!validStartMonth){
        dataValidation['start-month'] = 'Month you started living at this address must be a number';
    }

    if(!validStartYear){
        dataValidation['start-year'] = 'Year you started living at this address must be a number';
    }

    if (!req.body['start-month']) {
        dataValidation['start-month'] = 'Enter month you started living at this address';
    }
    if (!req.body['start-year']) {
        dataValidation['start-year'] = 'Enter year you started living at this address';
    } else {
        const inputtedStartDate = new Date(req.body['start-year'], req.body['start-month'] - 1);

        if (inputtedStartDate.valueOf() >= date.valueOf()) {
            dataValidation['from'] = 'Date you started living at this address must be in the past';
        }
    }

    if (req.query.address == 'previous') {
        if (req.body['end-month'] < 1 || req.body['end-month'] > 12) {
            dataValidation['end-month'] = 'The month you stopped living at this address must be a number between 1 and 12';
        }
        if (req.body['end-year'] < 1899 || req.body['end-year'] > 2200) {
            dataValidation['end-year'] = 'The year you stopped living at this address must be a number between 1900 and 2200';
        }

        if (req.body['end-year'].length != 4) {
            dataValidation['end-year'] = 'Year you stopped living at this address must include four numbers';
        }

        if(!validEndMonth){
            dataValidation['end-month'] = 'Month you stopped living at this address must be a number';
        }
    
        if(!validEndYear){
            dataValidation['end-year'] = 'Year you stopped living at this address must be a number';
        }

        if (!req.body['end-month']) {
            dataValidation['end-month'] = 'Enter month you stopped living at this address';
        }
        if (!req.body['end-year']) {
            dataValidation['end-year'] = 'Enter year you stopped living at this address';
        } else {
            const inputtedStartDate = new Date(req.body['start-year'], req.body['start-month'] - 1);
            const inputtedEndDate = new Date(req.body['end-year'], req.body['end-month'] - 1);

            if (inputtedEndDate.valueOf() >= date.valueOf()) {
                dataValidation['to'] = 'Date you stopped living at this address must be in the past';
            }

            if (inputtedStartDate.valueOf() >= inputtedEndDate.valueOf()) {
                dataValidation['to'] = 'Date you stopped living at this address must be after start date';
            }
        }
    }

    if (Object.keys(dataValidation).length) {
        if (req.query.address == 'previous') {
            res.render('citizen-application/address-confirm', {
                cache: inputCache,
                validation: dataValidation,
                address: req.session.data['temp-previous-address'],
                query: req.query,
            });
        } else {
            res.render('citizen-application/address-confirm', {
                cache: inputCache,
                validation: dataValidation,
                address: req.session.data.current_address,
                query: req.query,
            });
        }
    } else {
        if (req.query.address == 'previous') {
            req.session.data['temp-previous-address']['start-month'] = getMonth(req.body['start-month']);
            req.session.data['temp-previous-address']['start-year'] = req.body['start-year'];
            req.session.data['temp-previous-address']['end-month'] = getMonth(req.body['end-month']);
            req.session.data['temp-previous-address']['end-year'] = req.body['end-year'];
            const previous_addresses = req.session.data.previous_addresses || [];

            previous_addresses.push(req.session.data['temp-previous-address']);
            req.session.data.previous_addresses = previous_addresses;
        } else {
            req.session.data.current_address['start-month'] = getMonth(req.body['start-month']);
            req.session.data.current_address['start-year'] = req.body['start-year'];

            const current_addresses = req.session.data.current_addresses || [];
            current_addresses.push(req.session.data.current_address);
            req.session.data.current_addresses = current_addresses;
        }

        req.session.cache[req.originalUrl.split('?')[0]] = {};
        res.redirect('lived-elsewhere');
    }
});

// BFPO - Mock Addresses
const BFPO_ADDRESSES = [{ id: 2, lineOne: 'BFPO 1', postcode: 'BF1 3AA', townOrCity: 'Washington', country: 'USA' }];

citizenRouter.get('/bfpo', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/bfpo', { cache: inputCache, validation: null });
});

citizenRouter.post('/bfpo', (req, res) => {
    let parameterString = '';
    if (req.query.address) {
        parameterString = '&address=' + req.query.address;
    }

    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let selectedBFPO = BFPO_ADDRESSES.filter(value => value.id == req.body['bfpo'])[0];

    if (!selectedBFPO) {
        dataValidation['bfpo'] = 'Enter a valid BFPO number';
    }

    if (!req.body['bfpo']) {
        dataValidation['bfpo'] = 'Enter BFPO number';
    }


    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/bfpo', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        if (req.query.address == 'previous') {
            req.session.data['temp-previous-address'] = selectedBFPO;
            req.session.cache[req.originalUrl.split('?')[0]] = {};
            return res.redirect('address-confirm?location=bfpo' + parameterString);
        }
        if (req.query.address == 'current') {
            req.session.data.current_address = selectedBFPO;
            req.session.cache[req.originalUrl.split('?')[0]] = {};
            return res.redirect('address-confirm?location=bfpo' + parameterString);
        } else {
            req.session.data.temp_current = {};
            req.session.data.temp_current['lookup-addr'] = selectedBFPO['lineOne'];
            req.session.data.temp_current['lookup-addr-2'] = selectedBFPO['lineTwo'];
            req.session.data.temp_current['hidden-details-town'] = selectedBFPO['townOrCity'];
            req.session.data.temp_current['hidden-details-country'] = selectedBFPO['country'];
            req.session.data.temp_current['postcode-lookup'] = selectedBFPO['postcode'];
            res.redirect('confirm-current-address');
        }
    }
});

citizenRouter.get('/no-address', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/no-address', { cache: inputCache, validation: null });
});

citizenRouter.post('/no-address', (req, res) => {
    let parameterString = '';
    if (req.query.address) {
        parameterString = '&address=' + req.query.address;
    }

    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    const validCity = /^[a-zA-Z'\- ]+$/.test(req.body['townOrCity']); //A1

    if (!validCity) {
        dataValidation['townOrCity'] = 'Town or city must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (req.body['townOrCity'].length < 2 || req.body['townOrCity'].length > 50) {
        dataValidation['townOrCity'] = 'Town or city must be between 2 and 50 characters';
    }

    if (!req.body['townOrCity']) {
        dataValidation['townOrCity'] = 'Enter town or city';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/no-address', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        if (req.query.address == 'previous') {
            req.session.data['temp-previous-address'] = req.body;
        } else {
            req.session.data.current_address = req.body;
        }

        req.session.cache[req.originalUrl.split('?')[0]] = {};
        res.redirect('address-confirm?location=no-address' + parameterString);
    }
});

citizenRouter.get('/outside-uk', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/outside-uk', { cache: inputCache, validation: null });
});

citizenRouter.post('/outside-uk', (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let parameterString = '';
    const validAddressLine1 = /^[a-zA-Z0-9- '&.,]+$/.test(req.body['lookup-addr']); //A2
    const validCity = /^[a-zA-Z'\- ]+$/.test(req.body['hidden-details-town']); //A1
    const validCountry = /^[a-zA-Z'\- ]+$/.test(req.body['hidden-details-country']); //A1

    if (!validAddressLine1) {
        dataValidation['lookup-addr'] =
            'Address line 1 must only include letters a to z, numbers, hyphens, spaces, apostrophes, ampersands, full stops and commas';
    }

    if (!validCity) {
        dataValidation['hidden-details-town'] = 'Town or city must only include letters a to z, hyphens, spaces and apostrophes';
    }
 
    if (!validCountry) {
        dataValidation['hidden-details-country'] = 'Country must only include letters a to z, hyphens, spaces and apostrophes';
    }

    if (req.body['lookup-addr'].length < 2 || req.body['lookup-addr'].length > 200) {
        dataValidation['lookup-addr'] = 'Address line 1 must be between 2 and 200 characters';
    }

    if (req.body['hidden-details-town'].length < 2 || req.body['hidden-details-town'].length > 50) {
        dataValidation['hidden-details-town'] = 'Town or city must be between 2 and 50 characters';
    }

    if (req.body['hidden-details-country'].length < 2 || req.body['hidden-details-country'].length > 30) {
        dataValidation['hidden-details-country'] = 'Address line 1 must be between 2 and 30 characters';
    }

    if (!req.body['lookup-addr']) {
        dataValidation['lookup-addr'] = 'Enter address line 1';
    }

    if (!req.body['hidden-details-town']) {
        dataValidation['hidden-details-town'] = 'Enter town or city';
    }

    if (!req.body['hidden-details-country']) {
        dataValidation['hidden-details-country'] = 'Enter country';
    }
    
    if (!req.body['postcode-lookup']) {
        dataValidation['postcode-lookup'] = 'Enter postcode';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/outside-uk', {
            cache: inputCache,
            validation: dataValidation,
            query: req.query,
        });
    } else {
        if (req.query.address == 'previous') {
            req.session.data['temp-previous-address'] = {};
            req.session.data['temp-previous-address']['lineOne'] = req.body['lookup-addr'];
            req.session.data['temp-previous-address']['lineTwo'] = req.body['lookup-addr-2'];
            req.session.data['temp-previous-address']['townOrCity'] = req.body['hidden-details-town'];
            req.session.data['temp-previous-address']['country'] = req.body['hidden-details-country'];
            req.session.data['temp-previous-address']['postcode'] = req.body['postcode-lookup'];
            req.session.cache[req.originalUrl.split('?')[0]] = {};
            return res.redirect('address-confirm?location=outside-uk' + parameterString);
        }
        if (req.query.address == 'current') {
            req.session.data.current_address = {};
            req.session.data.current_address['lineOne'] = req.body['lookup-addr'];
            req.session.data.current_address['lineTwo'] = req.body['lookup-addr-2'];
            req.session.data.current_address['townOrCity'] = req.body['hidden-details-town'];
            req.session.data.current_address['country'] = req.body['hidden-details-country'];
            req.session.data.current_address['postcode'] = req.body['postcode-lookup'];
            req.session.cache[req.originalUrl.split('?')[0]] = {};
            return res.redirect('address-confirm?location=outside-uk' + parameterString);
        } else {
            req.session.data.temp_current = req.body;
            res.redirect('confirm-current-address');
        }
    }
});

citizenRouter.get('/lived-elsewhere', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);
    let currentDate = new Date();
    const nameOfMonth = currentDate.toLocaleString('default', {
        month: 'long',
    });
    const year = currentDate.getFullYear() - 5;
    const date = nameOfMonth + ' ' + year;

    res.render('citizen-application/lived-elsewhere', {
        cache: inputCache,
        validation: null,
        certAddress: req.session.data['cert-address'],
        currentAddress: req.session.data['current_addresses'],
        previousAddresses: req.session.data.previous_addresses,
        date: date,
    });
});

citizenRouter.post('/lived-elsewhere', invalidateCache, (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);
    let currentDate = new Date();
    const nameOfMonth = currentDate.toLocaleString('default', {
        month: 'long',
    });
    const year = currentDate.getFullYear() - 5;
    const date = nameOfMonth + ' ' + year;

    if (!req.body['lived-elsewhere']) {
        dataValidation['lived-elsewhere'] = 'Select if you have lived anywhere else from ' + date + ' to now';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/lived-elsewhere', {
            cache: inputCache,
            validation: dataValidation,
            certAddress: req.session.data['cert-address'],
            currentAddress: req.session.data.current_addresses,
            previousAddresses: req.session.data.previous_addresses,
            date: date,
        });
    } else {
        if (req.body['lived-elsewhere'] == 'Yes') {
            res.redirect('lived-elsewhere-confirm');
            // res.redirect('living-location?address=previous');
        } else {
            res.redirect('telephone-number');
        }
    }
});

citizenRouter.get('/lived-elsewhere-confirm', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/lived-elsewhere-confirm', {
        cache: inputCache,
        validation: null,
    });
});

citizenRouter.post('/lived-elsewhere-confirm', invalidateCache, (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);

    if (!req.body['lived-elsewhere-confirm']) {
        dataValidation['lived-elsewhere-confirm'] = 'Select what type of address you want to tell us about';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/lived-elsewhere-confirm', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        res.redirect('living-location?address=' + req.body['lived-elsewhere-confirm']);
    }
});

citizenRouter.get('/previous-convictions', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/previous-convictions', {
        cache: inputCache,
        validation: null,
    });
});

citizenRouter.post('/previous-convictions', invalidateCache, (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);

    if (!req.body['previous-convictions']) {
        dataValidation['previous-convictions'] = 'Select if you have any previous convictions or cautions';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/previous-convictions', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        res.redirect('review-application');
    }
});

citizenRouter.get('/declaration', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

    res.render('citizen-application/declaration', {
        cache: inputCache,
        validation: null,
    });
});

citizenRouter.post('/declaration', invalidateCache, (req, res) => {
    let dataValidation = {};
    savePageData(req, req.body);
    const inputCache = loadPageData(req);

    if (req.body['confirmation'] == '_unchecked') {
        dataValidation['confirmation'] = 'Tick the box to confirm you agree with the declaration';
    }

    if (req.body['ts-n-cs'] == '_unchecked') {
        dataValidation['ts-n-cs'] = 'Tick the box to confirm you agree with the declaration';
    }

    if (Object.keys(dataValidation).length) {
        res.render('citizen-application/declaration', {
            cache: inputCache,
            validation: dataValidation,
        });
    } else {
        res.redirect('confirmation');
    }
});

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Ids documented here https://carpathia.atlassian.net/wiki/spaces/SEAS/pages/7514423306/Application+Status
const STATUS_COLLECTION = [
    { id: '001', text: 'SENT TO APPLICANT' },
    { id: '002', text: 'REJECTED' },
    { id: '003', text: 'CHECK ANSWERS' },
    { id: '004', text: 'APPLICANT AMENDING' },
    { id: '005', text: 'ID CHECK REQUIRED' },
    { id: '006', text: 'READY TO SUBMIT' },
    { id: '007', text: 'APPLICATION SUBMITED' },
    { id: '008', text: 'CERTIFICATE ISSUED' },
    { id: '009', text: 'CANCELLED' },
];

const STATUS_COLLECTION1 = [
    { id: '1', text: 'ID check required' },
    { id: '2', text: 'Ready to submit' },
    { id: '3', text: 'Sent to applicant' },
    { id: '4', text: 'Submitted to DBS' },
    { id: '5', text: 'Cancelled' },
    { id: '6', text: 'Rejected' },
    { id: '7', text: 'Certificate issued' },
];

const ORGANISATION = ['Org A', 'Org B', 'Org C', 'Castle Healthcare'];

dashboardRouter.get('*', (req, res, next) => {
    if (req.session.data.applications !== undefined) return next();
    req.session.data.appStatus = STATUS_COLLECTION1;
    req.session.data.organisations = ORGANISATION;
    const statuses = STATUS_COLLECTION1;
    const types = ['Standard', 'Enhanced', 'Enhanced with barred'];
    const actions = ['Ready to submit', 'Application Expired', 'Certificate sent'];

    req.session.data.notifications = Array.from(Array(getRandomArbitrary(2, 11))).map((_, elIndex) => {
        const date = randomDate(new Date(2021, 11, 10), new Date());
        return {
            name: `${firstNames[elIndex]} ${lastNames[elIndex]}`,
            action: actions[getRandomArbitrary(0, actions.length - 1)],
            date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        };
    });
    req.session.data.applications = Array.from(Array(getRandomArbitrary(15, 25))).map((_, elIndex) => {
        const randomdate = randomDate(new Date(2021, 11, 10), new Date());
        let date = randomdate.getDate();
        let month = randomdate.getMonth() + 1;
        if (date < 10) {
            date = '0' + date;
        }
        if (month < 10) {
            month = '0' + month;
        }
        const year = randomdate.getFullYear();
        const ref = new RandExp(/^[A-Z]{4}[0-9]{4}[A-Z]$/, {
            extractSetAverage: true,
        }).gen();
        return {
            ref,
            name: `${firstNames[elIndex]} ${lastNames[elIndex]}`,
            firstName: `${firstNames[elIndex]}`,
            middleName: '',
            surname: `${lastNames[elIndex]}`,
            status: statuses[getRandomArbitrary(0, statuses.length)],
            type: types[getRandomArbitrary(0, types.length)],
            // date: `${date}/${month}/${year}`,
            date: randomdate.valueOf(),
            readableDate: `${date}/${month}/${year}`,
            email: `${firstNames[elIndex]}-${lastNames[elIndex]}@mail.com`,
            organisation: `${ORGANISATION[Math.floor(Math.random() * ORGANISATION.length)]}`,
            history: [
                {
                    person: 'John Smith',
                },
            ],
        };
    });

    req.session.data.applications[0] = {
        ref: 'MATT0711',
        name: 'Matthew Peter Adler',
        firstName: 'Matthew',
        middleName: 'Peter',
        surname: 'Adler',
        status: statuses[0],
        type: types[1],
        date: new Date('06/07/2022').valueOf(),
        readableDate: '07/06/2022',
        email: 'matthewadler@myemail.com',
        prevNames: [
            {
                first_name: 'Matthew',
                middle_names: 'John',
                last_name: 'Adler',
                used_from: '06/1997',
                used_to: '01/2011',
            },
            {
                first_name: 'Matthew',
                middle_names: 'John',
                last_name: 'Richards',
                used_from: '04/1989',
                used_to: '06/1997',
            },
        ],
        dob: '12/04/1989',
        sex: 'Male',
        nino: 'AA112201A',
        licence: 'ADLER345456MJ7RJ',
        passport: '946890102',
        passportCountry: 'United Kingdom',
        nationality: 'British',
        addressTown: 'Liverpool',
        addressCountry: 'United Kingdom',
        address: [
            {
                lineOne: '37 Stroma Road',
                lineTwo: 'Allerton',
                townOrCity: 'Liverpool',
                postcode: 'L18 9SN',
                country: 'United Kingdom',
            },
        ],
        changedAddress: 'yes',
        previous_addresses: [
            {
                lineOne: '12 Main Road',
                lineTwo: 'Allerton',
                townOrCity: 'Liverpool',
                postcode: 'L17 1SN',
                country: 'United Kingdom',
                startYear: '2020',
                endYear: '2021',
            },
            {
                lineOne: '23b River Street',
                lineTwo: 'Allerton',
                townOrCity: 'Liverpool',
                postcode: 'WS2 9PZ',
                country: 'United Kingdom',
                startYear: '2017',
                endYear: '2020',
            },
        ],
        phoneNumber: '07777 111111',
        previousConvictions: 'no',
        organisation: 'Castle Healthcare',
        position: 'Nurse',
        appType: 'New employee',
        workforce: 'Adult and Child',
        children_or_adults: 'No',
        history: [
            {
                action: 'Viewed application details',
                date: '10/06/2022',
                time: '11:14am',
                person: 'Gill Henderson (me)',
            },
            {
                action: 'Viewed application details',
                date: '09/06/2022',
                time: '02:12pm',
                person: 'Colin Hawshaw',
            },
            {
                action: 'Viewed application details',
                date: '09/06/2022',
                time: '12:05pm',
                person: 'Colin Hawshaw',
            },
            {
                action: 'Applicant completed application form',
                date: '08/06/2022',
                time: '06:44pm',
                person: 'Applicant',
            },
            {
                action: 'Sent to applicant',
                date: '07/06/2022',
                time: '10:17am',
                person: 'Gill Henderson (me)',
            },
            {
                action: 'Started application',
                date: '07/06/2022',
                time: '09:45am',
                person: 'Gill Henderson (me)',
            },
        ],
    };

    req.session.data.filteredApplications = req.session.data.applications;
    req.session.data.filteredApplications.sort((a, b) => {
        return a.status['id'] - b.status['id'];
    });
    return next();
});

// Work has been "archived" as requested in the stand up meeting 18 July 2022
// This is a workaround to be able to redirect to the page required in SEAS-429, the development for "index" route was missing
// This is tech debt and should be implemented correctly
// dashboardRouter.post('/index', (req,res, _next) => {
//     if (req.body['login-method']) {
//         res.redirect('/dashboard/login?render-login-as=' + req.body['login-method']);
//     } else {
//         res.redirect('/dashboard/index');
//     }
// });

// Work has been "archived" as requested in the stand up meeting 18 July 2022
// This is a workaround to be able to redirect to the page required in SEAS-429, the development for "login" route was missing
// This is tech debt and should be implemented correctly
// dashboardRouter.post('/login', (req,res, _next) => {
//     const emailValue = req.body?.email || 'testingvalue@email.com';
//     if (req.query['render-login-as'] === 'kba-login' || req.query['render-login-as'] === 'email-password-login') {
//         res.redirect('/dashboard/email-otp?email=' + emailValue + '&render-login-as=' + req.query['render-login-as']);
//     } else if (req.query['render-login-as'] === 'email-2fa-login') {
//         res.redirect('/dashboard/opt-verify');
//     } else {
//         res.redirect('/dashboard/home');
//     }
// });

dashboardRouter.get('/rb-login', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);
    res.render('dashboard/rb-login', { cache: inputCache, validation: null });
});

dashboardRouter.post('/rb-login', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);

    const dataValidation = {};
    const RbNumbersOnly = /^[0-9]+$/.test(req.body['registered-body-nr']);
    const CsNumbersOnly = /^[0-9]+$/.test(req.body['counter-signatory-nr']);
    let selectedUser = undefined;

    if (!RbNumbersOnly) {
        dataValidation['registered-body-nr'] = 'Registered Body number must be a number';
    }

    if (!CsNumbersOnly) {
        dataValidation['counter-signatory-nr'] = 'Countersignatory number must be a number';
    }

    if (req.body['registered-body-nr'].length != 11) {
        dataValidation['registered-body-nr'] = 'Registered Body number must be 11 characters';
    }

    if (req.body['counter-signatory-nr'].length != 11) {
        dataValidation['counter-signatory-nr'] = 'Countersignatory number must be 11 characters';
    }

    if (!req.body['registered-body-nr']) {
        dataValidation['registered-body-nr'] = 'Enter Registered Body number';
    }

    if (!req.body['counter-signatory-nr']) {
        dataValidation['counter-signatory-nr'] = 'Enter countersignatory number';
    }

    if (
        req.body['registered-body-nr'] &&
        req.body['counter-signatory-nr'] &&
        req.body['registered-body-nr'].length == 11 &&
        req.body['counter-signatory-nr'].length == 11 &&
        CsNumbersOnly &&
        RbNumbersOnly
    ) {
        const rbNumber = req.body['registered-body-nr'].trim();
        const csNumber = req.body['counter-signatory-nr'].trim();

        if (req.session?.mockDBaccounts) {
            selectedUser = req.session?.mockDBaccounts.find(el => rbNumber === el.rbNumber && csNumber === el.csNumber);
            if (!selectedUser) {
                dataValidation['registered-body-nr'] = 'Unable to find your details, please check your number and try again';
                dataValidation['counter-signatory-nr'] = 'Unable to find your details, please check your number and try again';
            } else {
                req.session.selectedRB = selectedUser;
            }
        }
    }
    if (Object.keys(dataValidation).length) {
        res.render('dashboard/rb-login', { cache: inputCache, validation: dataValidation });
    } else if (selectedUser && selectedUser.hasSetPassword) {
        res.redirect('/dashboard/rb-password-check');
    } else {
        res.redirect('/dashboard/rb-dob-check');
    }
});

dashboardRouter.get('/rb-password-check', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);

    if (!req.session?.selectedRB) {
        res.redirect('/dashboard/rb-login');
    } else {
        res.render('dashboard/rb-password-check', { cache: inputCache, validation: null });
    }
});

dashboardRouter.post('/rb-password-check', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);
    const dataValidation = {};

    if (req.body['password'].length < 8) {
        dataValidation['password'] = 'Password must be 8 characters or more';
    } else if (!req.body['password']) {
        dataValidation['password'] = 'Enter password';
    } 
    
    else if (req.body.password !== req.session?.selectedRB?.password) {
        dataValidation['password'] = 'Password is invalid';
    }

    if (Object.keys(dataValidation).length) {
        res.render('dashboard/rb-password-check', { cache: inputCache, validation: dataValidation });
    } else {
        res.redirect('/dashboard/email-otp');
    }
});

dashboardRouter.get('/home', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);
    // if (!req.session?.selectedRB) {
    //     res.redirect('/dashboard/rb-login');
    // } else {
    //     res.render('dashboard/home', { cache: inputCache, validation: null });
    // }

    if (Object.keys(req.query).length === 0) {
        req.session.data.needsActionFilter = null;
        req.session.data.appStatusFilter = null;
        req.session.data.orgFilter = null;
        req.session.data.search = '';
        req.session.data.filteredApplications = req.session.data.applications;
    }

    if (req.query.filter == '') {
        req.session.data.needsActionFilter = null;
        req.session.data.appStatusFilter = null;
        req.session.data.orgFilter = null;
    }

    if (req.query.name == '') {
        req.session.data.search = '';
    }

    res.render('dashboard/home', {
        cache: inputCache,
        validation: null,
        filteredApplications: req.session.data.filteredApplications,
        query: req.query,
        search: req.session.data.search,
        needsActionFilter: req.session.data.needsActionFilter,
        appStatusFilter: req.session.data.appStatusFilter,
        orgFilter: req.session.data.orgFilter,
    });
});

dashboardRouter.post('/search-name', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);
    if (!req.session.data.filters) {
        req.session.data.filters = {
            'needs-action': '_unchecked',
            'app-status': '_unchecked',
            organisation: '_unchecked',
        };
    }
    let x = filterAppList(req, res);
    req.session.data.search = req.body['search-name'];
    searchFilter(req, res);
    res.redirect('/dashboard/home?name=' + req.session.data.search);
});

dashboardRouter.post('/filter', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    req.session.data.filters = req.body;
    req.session.data.needsActionFilter = null;
    req.session.data.appStatusFilter = null;
    req.session.data.orgFilter = null;

    let urlString = filterAppList(req, res);
    searchFilter(req, res);
    res.redirect('/dashboard/home?filter=' + urlString);
});

dashboardRouter.post('/delete-filter', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    if (req.query['delete'] == 'needs-action') {
        req.session.data.filters['needs-action'] = '_unchecked';
    }

    if (req.query['id']) {
        req.session.data.filters['app-status'] = req.session.data.filters['app-status'].filter(app => {
            return app != req.query['id'];
        });
    }

    if (req.query['org']) {
        req.session.data.filters['organisation'] = req.session.data.filters['organisation'].filter(app => {
            return app != req.query['org'];
        });
    }

    let urlString = filterAppList(req, res);
    searchFilter(req, res);
    res.redirect('/dashboard/home?filter=' + urlString);
});

// SEAS 503 Password reset
dashboardRouter.get('/rb-password-reset', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);

    if (!req.session?.selectedRB) {
        res.redirect('/dashboard/rb-login');
    } else {
        res.render('dashboard/rb-password-reset', { cache: inputCache, validation: null });
    }
});

// POST SEAS 503 Password reset
dashboardRouter.post('/rb-password-reset', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);
    const user = req.session?.selectedRB;
    const validEmail =
        /^(?!\.)(?!.*\.\.)(?!.*\.$)(?!.*@.*@)[a-zA-Z0-9&'+=_\-\/]([\.a-zA-Z0-9&'+=_\-\/]){0,63}@[a-zA-Z0-9\-]{1,63}(\.([a-zA-Z0-9\-]){1,63}){0,}$/.test(
            req.body['rb-reset-pass-email'],
        );
    const dataValidation = {};

    if (!user) {
        res.redirect('/dashboard/rb-login');
    } else {
        // if (user.email.toLowerCase().trim() !== req.body['rb-reset-pass-email'].toLowerCase().trim()) {
        //     dataValidation['rb-reset-pass-email'] = 'The email entered does not match your records, try again';
        // }
        if (!validEmail) {
            dataValidation['rb-reset-pass-email'] = 'Enter email address in the correct format';
        }
        if (req.body['rb-reset-pass-email'].length > 100) {
            dataValidation['rb-reset-pass-email'] = 'Email address must be 100 characters or fewer';
        }
        if (!req.body['rb-reset-pass-email']) {
            dataValidation['rb-reset-pass-email'] = 'Enter email address';
        }
    }

    if (Object.keys(dataValidation).length) {
        res.render('dashboard/rb-password-reset', { cache: inputCache, validation: dataValidation });
    } else {
        res.redirect('/dashboard/reset-pass-email-otp');
    }
});

// GET SEAS 503 reset-pass-email-otp

dashboardRouter.get('/reset-pass-email-otp', invalidateCache, (req, res, _next) => {
    if (!req.session?.selectedRB) {
        res.redirect('/dashboard/rb-login');
    } else {
        res.render('dashboard/reset-pass-email-otp', { cache: null, email: req.session?.selectedRB?.email || '', validation: null });
    }
});

// POST SEAS 503 reset-pass-email-otp

dashboardRouter.post('/reset-pass-email-otp', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);

    if (!req.body['reset-pass-email-otp']) {
        res.render('dashboard/reset-pass-email-otp', {
            cache: inputCache,
            email: req.session?.selectedRB?.email || '',
            validation: { 'reset-pass-email-otp': 'Enter security code' },
        });
    } else {
        res.redirect('/dashboard/rb-reset-password');
    }
});

//GET SEAS 503 /rb-reset-password
dashboardRouter.get('/rb-reset-password', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);

    if (!req.session?.selectedRB) {
        res.redirect('/dashboard/rb-login');
    } else {
        res.render('dashboard/rb-reset-password', { cache: inputCache, validation: null });
    }
});

//POST SEAS 503 /rb-reset-password
dashboardRouter.post('/rb-reset-password', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);
    const dataValidation = {};

    const user = req.session?.selectedRB;

    if (!req.body['password-first']) {
        dataValidation['password-first'] = 'Enter password';
    } else if (req.body['password-first'].length < 8) {
        dataValidation['password-first'] = 'The password has to be at least 8 characters or more';
    }

    if (!req.body['password-match']) {
        dataValidation['password-match'] = 'Enter password';
    }

    if (req.body['password-first'] && req.body['password-match'] && req.body['password-first'] !== req.body['password-match']) {
        dataValidation['password-match'] = 'Passwords do not match';
    } else if (user) {
        let newUserState = { ...user };
        newUserState.password = req.body['password-first'];

        const newCollection = req.session.mockDBaccounts.map(el => {
            if (el.rbNumber === newUserState.rbNumber) {
                return newUserState;
            } else {
                return el;
            }
        });

        req.session.mockDBaccounts = newCollection;
    }

    if (Object.keys(dataValidation).length) {
        res.render('dashboard/rb-reset-password', { cache: inputCache, validation: dataValidation });
    } else {
        res.redirect('/dashboard/rb-reset-password-confirm');
    }
});

// SEAS-503 /rb-reset-password-confirm

dashboardRouter.get('/rb-reset-password-confirm', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);

    if (!req.session?.selectedRB) {
        res.redirect('/dashboard/rb-login');
    } else {
        res.render('dashboard/rb-reset-password-confirm', { cache: inputCache, validation: null });
    }
});

//GET /rb-dob-check
dashboardRouter.get('/rb-dob-check', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);

    if (!req.session?.selectedRB) {
        res.redirect('/dashboard/rb-login');
    } else {
        res.render('dashboard/rb-dob-check', { cache: inputCache, validation: null });
    }
});

//POST /rb-dob-check
dashboardRouter.post('/rb-dob-check', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);
    const dataValidation = {};

    const user = req.session?.selectedRB;
    const date = new Date();
    // const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

    if (user && user.userDob) {
        const dataDate = req.body['dob-day'].padStart(2, '0') + '/' + req.body['dob-month'].padStart(2, '0') + '/' + req.body['dob-year'];

        if (req.body['dob-day'] < 1 || req.body['dob-day'] > 31) {
            dataValidation['dob-day'] = 'The day of date of birth must be between 1 and 31';
        }

        if (req.body['dob-month'] < 1 || req.body['dob-month'] > 12) {
            dataValidation['dob-month'] = 'The month of date of birth must be between 1 and 12';
        }

        if (req.body['dob-year'] < 1899 || req.body['dob-year'] > 2200) {
            dataValidation['dob-year'] = 'The year of date of birth must be a number between 1900 and less than or equal to 2200';
        }

        if (req.body['dob-year'].length != 4) {
            dataValidation['dob-year'] = 'Year must include four numbers';
        }

        if (!req.body['dob-day']) {
            dataValidation['dob-day'] = 'Date of birth must include a day';
        }

        if (!req.body['dob-month']) {
            dataValidation['dob-month'] = 'Date of birth must include a month';
        }

        if (!req.body['dob-year']) {
            dataValidation['dob-year'] = 'Date of birth must include a year';
        } 
        
        // else {
        //     if (!moment(user.userDob, 'DD/MM/YYYY').isSame(moment(dataDate, 'DD/MM/YYYY'))) {
        //         dataValidation['dob'] = 'Date of birth does not match';
        //     }
        // }
    }

    if (Object.keys(dataValidation).length) {
        res.render('dashboard/rb-dob-check', { cache: inputCache, validation: dataValidation });
    } else {
        res.redirect('/dashboard/email-otp');
    }
});

//GET /rb-create-password
dashboardRouter.get('/rb-create-password', invalidateCache, (req, res, _next) => {
    const inputCache = loadPageData(req);

    if (!req.session?.selectedRB) {
        res.redirect('/dashboard/rb-login');
    } else {
        res.render('dashboard/rb-create-password', { cache: inputCache, validation: null });
    }
});

//POST /rb-create-password
dashboardRouter.post('/rb-create-password', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);
    const dataValidation = {};

    const user = req.session?.selectedRB;

    if (!req.body['password-first']) {
        dataValidation['password-first'] = 'Enter password';
    } else if (req.body['password-first'].length < 8) {
        dataValidation['password-first'] = 'Password must be 8 characters or more';
    }

    if (!req.body['password-match']) {
        dataValidation['password-match'] = 'Enter password to confirm';
    }

    if (req.body['password-first'] && req.body['password-match'] && req.body['password-first'] !== req.body['password-match']) {
        dataValidation['password-match'] = 'Your passwords do not match, please re-enter and try again';
    } else if (user) {
        let newUserState = { ...user };
        newUserState.hasSetPassword = true;
        newUserState.password = req.body['password-first'];

        const newCollection = req.session.mockDBaccounts.map(el => {
            if (el.rbNumber === newUserState.rbNumber) {
                return newUserState;
            } else {
                return el;
            }
        });

        req.session.mockDBaccounts = newCollection;
    }

    if (Object.keys(dataValidation).length) {
        res.render('dashboard/rb-create-password', { cache: inputCache, validation: dataValidation });
    } else {
        res.redirect('/dashboard/home');
    }
});

dashboardRouter.get('/email-otp', invalidateCache, (req, res, _next) => {
    let backButton = '/dashboard/rb-dob-check';
    if (req.session?.selectedRB && req.session.selectedRB.hasSetPassword) {
        backButton = '/dashboard/rb-password-check';
    }
    res.render('dashboard/email-otp', { backButton: backButton, cache: null, email: req.session?.selectedRB?.email || '', validation: null });
});

dashboardRouter.post('/email-otp', invalidateCache, (req, res, _next) => {
    savePageData(req, req.body);

    const inputCache = loadPageData(req);
    let backButton = '/dashboard/rb-dob-check';
    const dataValidation = {};
    const numbersOnly = /^[0-9]+$/.test(req.body['otp-code']);

    if (req.session?.selectedRB && req.session.selectedRB.hasSetPassword) {
        backButton = '/dashboard/rb-password-check';
    }

    if (req.body['otp-code'].length != 6) {
        dataValidation['otp-code'] = 'Security code must be 6 characters';
    }
    if (!numbersOnly) {
        dataValidation['otp-code'] = 'Security code must be a number';
    }

    if (!req.body['otp-code']) {
        dataValidation['otp-code'] = 'Enter security code';
    }

    if (Object.keys(dataValidation).length) {
        res.render('dashboard/email-otp', {
            backButton: backButton,
            cache: inputCache,
            email: req.session?.selectedRB?.email || '',
            validation: dataValidation,
        });
    } else {
        if (req.session?.selectedRB && !req.session.selectedRB.hasSetPassword) {
            res.redirect('/dashboard/rb-create-password');
        } else {
            res.redirect('/dashboard/home');
        }
    }
});

dashboardRouter.get('/details', (req, res) => {
    const data = req.session.data;
    const applications = data.applications;

    if (applications && req.query.app) {
        const item = applications.find(el => el.ref === req.query.app);
        req.session.data.selectedApplicationToCancel = item;
    }

    res.render('dashboard/details', { data: req.session.data.selectedApplicationToCancel, validation: null });
});

dashboardRouter.get('/details-confirm', (req, res) => {
    res.render('dashboard/details-confirm', { data: req.session.data.selectedApplicationToCancel, validation: null });
});

dashboardRouter.post('/details-confirm', validateApplicationDetailsConfirm);

dashboardRouter.get('/delete-notification', (req, res) => {
    const parsedIndex = parseInt(req.query.notif, 10);
    if (req.query.notif && typeof parsedIndex === 'number') {
        const notifications = [...req.session.data.notifications];
        notifications.splice(parsedIndex - 1, 1);
        req.session.data.notifications = notifications;
    }
    res.redirect(req.get('referer'));
});

dashboardRouter.get('/clear-notifications', (req, res) => {
    req.session.data.notifications = [];
    res.redirect(req.get('referer'));
});

router.use('/citizen-application', citizenRouter);
router.use('/registered-body', registeredBodyRouter);
router.use('/dashboard', dashboardRouter);

module.exports = router;
