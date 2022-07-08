const express = require('express');
const RandExp = require('randexp');

// middleware import
const { validateSex } = require('./middleware/validateSex');
const { validateNationalInsurance } = require('./middleware/validateNationalInsurance');
const { validateApplicationDetailsConfirm } = require('./middleware/validateApplicationDetailsConfirm');
const { validateWorkforceSelect } = require('./middleware/validateWorkforceSelect');
const { invalidateCache, loadPageData, savePageData } = require('./middleware/utilsMiddleware');
const { result } = require('lodash');

const router = express.Router();
const citizenRouter = express.Router(); 
const registeredBodyRouter = express.Router();
const dashboardRouter = express.Router();

const cms = {
    generalContent: {
        continue: "Continue",
    }
};

registeredBodyRouter.post('/select-flow', (req, res) => {
    const applicationType = req.session.data['what-application-type'];
    res.redirect(
        `${
            applicationType === 'Volunteer' ? `volunteer-declaration` : applicationType === 'New employee' ? 'applicant-name' : 'existing-post-holder'
        }${req.header('referer').includes('change=true') ? '?change=true' : ''}`,
    );
});

registeredBodyRouter.get('/enhanced/workforce-select', invalidateCache, (req, res) => {
    const inputCache = loadPageData(req);

   res.render('registered-body/enhanced/workforce-select', { cms, cache: inputCache, validation: null });

});

registeredBodyRouter.post('/enhanced/workforce-select',invalidateCache, validateWorkforceSelect);

// Add your routes here - above the module.exports line

/* region defs */
const firstNames = [
    'Kieran',
    'Christopher',
    'Jessica',
    'Matthew',
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
];
/* endregion */

router.post('/dbs-check-answer', (req, res) => {
    // Make a variable and give it the value from 'what-dbs-check'
    const whatDbsCheck = req.session.data['what-dbs-check'];
    // Check whether the variable matches a condition
    if (whatDbsCheck === 'Enhanced with barred list')
        return res.redirect(`registered-body/enhanced/barred-list-children${req.header('referer').includes('change=true') ? '?change=true' : ''}`);
    if (req.header('referer').includes('change=true')) return res.redirect('registered-body/check-answers');
    if (whatDbsCheck === 'Standard') return res.redirect('registered-body/position');
    if (whatDbsCheck === 'Enhanced') return res.redirect('registered-body/position');
    return undefined;
});

router.post('/pay-now-answer', (req, res) => {
    const whatPayment = req.session.data['payment-now'];

    if (whatPayment === 'Pay-now') {
        // Send user to next page
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
    if (req.header('referer').includes('certificate=true')) {
        req.session.data['send-cert-address'] = [address[0], address[1], address[2], address[3]];
        return res.redirect('previous-convictions');
    }
    const addresses = req.session.data.addresses || [];

    addresses.push({
        lineOne: address[0],
        lineTwo: address[1],
        townOrCity: address[2],
        postcode: address[3],
        country: address[4],
        startYear: address[5],
    });
    req.session.data.addresses = addresses;
    return res.redirect('previous-address');
});

citizenRouter.post('/add-homeless-or-travelling', (req, res) => {
    const addresses = req.session.data.addresses || [];
    const whyNoAddress = req.session.data['why-no-address'];
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
    return res.redirect('previous-address');
});

citizenRouter.post('/where-certificate', (req, res) => {
    if (req.session.data['where-to-send-cert'] === 'Current Address') return res.redirect('previous-convictions');
    return res.redirect('address-lookup?certificate=true');
});

// Start to declare proper routing

citizenRouter.get('/current-full-name-v2', invalidateCache, (req, res) => {
   res.render('citizen-application/current-full-name-v2', { cache: req.session.data.fullName, validation: null });

});

citizenRouter.post('/current-full-name-v2',invalidateCache, (req, res, next) => {
    if (req.body['full-name']) {
        req.session.data.fullName = req.body['full-name'];
    }
    res.redirect('/citizen-application/previous-names-q');
});

citizenRouter.get('/previous-names-q', invalidateCache, (req, res) => {

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
        validation['radio-group-alias-input'] = "Select if you been known by any other names";
        res.render('citizen-application/previous-names-q', { cache: inputCache, validation: validation });
    }
   
    if (data['radio-group-alias-input'] === false) {
        res.redirect('/citizen-application/date-of-birth');
    } else if (data['radio-group-alias-input'] === true) {
        res.redirect('/citizen-application/previous-names-form');
    }

});

citizenRouter.get('/previous-names-form', invalidateCache, (req, res) => {

    const inputCache = loadPageData(req);
   res.render('citizen-application/previous-names-form', { cache: inputCache, validation: null });
});

let mapInput = (data) => {
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
        resultObj.middle_names = notEntered;
    }
        

    if (data['full-name-last-name']) {
        resultObj.last_name = data['full-name-last-name'];
    } else {
        resultObj.last_name = notEntered;
    }

    if (data['alias-from-MM'] && data['alias-from-YYYY']) {
        resultObj.used_from = `${data['alias-from-MM'].padStart(2, '0')}/${data['alias-from-YYYY']}`;
    } else {
        resultObj.used_from = notEntered;
    }

    if (data['alias-to-MM'] && data['alias-to-YYYY']) {
        resultObj.used_to = `${data['alias-to-MM'].padStart(2, '0')}/${data['alias-to-YYYY']}`;
    }else {
        resultObj.used_to = notEntered;
    }

    return resultObj;
}

citizenRouter.post('/previous-names-form', invalidateCache, (req, res) => {
    savePageData(req, req.body);
    const inputCache = loadPageData(req);

    let collection = [];

    if (req.session.data.prevNames) {
        collection = req.session.data.prevNames;
    }   

    collection.push(mapInput(inputCache));

    req.session.data.prevNames = collection;
   res.redirect('/citizen-application/previous-names-list');
});

citizenRouter.get('/previous-names-list', invalidateCache, (req, res) => {

    const inputCache = loadPageData(req);

    let prevNames = [];

    if (req.session.data.prevNames) {
        prevNames = req.session.data.prevNames;
    }

   res.render('citizen-application/previous-names-list', { list: prevNames, cache: inputCache, validation: null });
});

citizenRouter.get('/sex',invalidateCache, (req, res) => {
    let prevValues = null;

    if (req.session.data.sex) {
      prevValues = { sex: req.session.data.sex };
    }
  
    res.render('citizen-application/sex', {cache: prevValues, validation: null });
});

citizenRouter.post('/sex', invalidateCache, validateSex);

citizenRouter.get('/national-insurance-number', invalidateCache, (req, res) => {
     const inputCache = loadPageData(req);

    res.render('citizen-application/national-insurance-number', { cache: inputCache, validation: null });

});

citizenRouter.post('/national-insurance-number',invalidateCache, validateNationalInsurance);


citizenRouter.post('/old-or-new', (req, res) => {
    if (req.session.data['existing-app'] === 'new') {
        return res.redirect('current-full-name');
    }
    return res.redirect('sex');
});

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

dashboardRouter.get('*', (req, res, next) => {
    if (req.session.data.applications !== undefined) return next();
    const statuses = ['Sent to Applicant', 'Expired', 'Verify ID', 'Ready to submit', 'Submitted', 'Sent for case-working', 'Cancelled'];
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
    req.session.data.applications = Array.from(Array(getRandomArbitrary(8, 15))).map((_, elIndex) => {
        const date = randomDate(new Date(2021, 11, 10), new Date());
        const ref = new RandExp(/^[A-Z]{4}[0-9]{4}[A-Z]$/, {
            extractSetAverage: true,
        }).gen();
        return {
            ref,
            name: `${firstNames[elIndex]} ${lastNames[elIndex]}`,
            status: statuses[getRandomArbitrary(0, statuses.length - 1)],
            type: types[getRandomArbitrary(0, types.length - 1)],
            date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        };
    });
    return next();
});

// This is a workaround to be able to redirect to the page required in SEAS-429, the development for "index" route was missing
// This is tech debt and should be implemented correctly
dashboardRouter.post('/index', (req,res, _next) => {
    if (req.body['login-method']) {
        res.redirect('/dashboard/login?render-login-as=' + req.body['login-method']);
    } else {
        res.redirect('/dashboard/index');
    }
});


// This is a workaround to be able to redirect to the page required in SEAS-429, the development for "login" route was missing
// This is tech debt and should be implemented correctly
dashboardRouter.post('/login', (req,res, _next) => {
    const emailValue = req.body?.email || 'testingvalue@email.com';
    if (req.query['render-login-as'] === 'kba-login' || req.query['render-login-as'] === 'email-password-login') {
        res.redirect('/dashboard/email-otp?email=' + emailValue + '&render-login-as=' + req.query['render-login-as']);
    } else if (req.query['render-login-as'] === 'email-2fa-login') {
        res.redirect('/dashboard/opt-verify');
    } else {
        res.redirect('/dashboard/home');
    }

});


dashboardRouter.get('/email-otp', invalidateCache, (req,res, _next) => {

    const emailValue = req.query?.email || 'testingvalue@email.com';
    res.render('dashboard/email-otp', { cache: null, data:  { email: emailValue },  validation: null });
});

dashboardRouter.post('/email-otp', invalidateCache, (req,res, _next) => {
    savePageData(req, req.body);

    const emailValue = req.query?.email || 'testingvalue@email.com';
    const inputCache = loadPageData(req);

    if (!req.body['otp-code']) {
        res.render('dashboard/email-otp', { email: emailValue, cache: inputCache,  validation: { 'otp-code': 'Enter security code' }});
    } else {
        res.redirect('/dashboard/home');
    }
});

dashboardRouter.get('/details', (req, res) => {

    const data = req.session.data;
    const applications = data.applications;

    if (applications && req.query.app) {
        const item = applications.find((el) => el.name === req.query.app);
        req.session.data.selectedApplicationToCancel = item;
    }

    res.render('dashboard/details', {data: req.session.data.selectedApplicationToCancel,  validation: null });
});

dashboardRouter.get('/details-confirm', (req, res) => {

    res.render('dashboard/details-confirm', {data: req.session.data.selectedApplicationToCancel, validation: null });
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
