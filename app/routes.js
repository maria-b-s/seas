const express = require('express');
const RandExp = require('randexp');

const router = express.Router();
const citizenRouter = express.Router();
const registeredBodyRouter = express.Router();

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
    const addresses = req.session.data.addresses || [];
    if (addresses.length === 0) {
        const currentAddress = req.session.data['current-address'];
        addresses.push({
            lineOne: currentAddress[0],
            lineTwo: currentAddress[1],
            townOrCity: currentAddress[2],
            postcode: currentAddress[3],
            country: currentAddress[4],
        });
    } else {
        const previousAddress = req.session.data['previous-address'];
        const previousAddressStart = req.session.data['previous-address-start'];
        const previousAddressEnd = req.session.data['previous-address-end'];
        addresses.push({
            lineOne: previousAddress[0],
            lineTwo: previousAddress[1],
            townOrCity: previousAddress[2],
            postcode: previousAddress[3],
            country: previousAddress[4],
            startDate: `${previousAddressStart[0]}/${previousAddressStart[1]}/${previousAddressStart[2]}`,
            endDate: `${previousAddressEnd[0]}/${previousAddressEnd[1]}/${previousAddressEnd[2]}`,
        });
    }
    req.session.data.addresses = addresses;
    return res.redirect('previous-address');
});

citizenRouter.post('/where-certificate', (req, res) => {
    if (req.session.data['where-to-send-cert'] === 'Current Address') return res.redirect('previous-convictions');
    return res.redirect('send-certification-location');
});

citizenRouter.post('/national-insurance', (req, res) => {
    if (req.session.data['has-national-insurance-number'] === 'no') return res.redirect('drivers-licence');
    return res.redirect('national-insurance-number');
});

registeredBodyRouter.post('/select-flow', (req, res) => {
    const applicationType = req.session.data['what-application-type'];
    res.redirect(
        `${
            applicationType === 'Volunteer' ? `volunteer-declaration` : applicationType === 'New employee' ? 'applicant-name' : 'existing-post-holder'
        }${req.header('referer').includes('change=true') ? '?change=true' : ''}`,
    );
});

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

router.use('/citizen-application', citizenRouter);
router.use('/registered-body', registeredBodyRouter);
router.use('/landing-page', (req, res, next) => {
    if (req.session.data.applications !== undefined) return next();
    const statuses = [
        'Sent to Applicant',
        'Expired',
        'Check Answers',
        'Applicant amending',
        'Verify Id',
        'Read to submit',
        'Application Submitted',
        'Sent for case-working',
        'cancelled',
    ];
    const types = ['Standard', 'Enhanced', 'Enhanced with barred'];

    req.session.data.applications = Array.from(Array(getRandomArbitrary(8, 15))).map((_, elIndex) => {
        const date = randomDate(new Date(2021, 11, 10), new Date());
        const ref = new RandExp(/^[A-Z]{4}[0-9]{4}[A-Z]$/, {
            extractSetAverage: true,
        }).gen();
        return {
            ref,
            name: `${firstNames[elIndex]} ${lastNames[elIndex]}`,
            status: statuses[getRandomArbitrary(0, 8)],
            type: types[getRandomArbitrary(0, 2)],
            date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        };
    });
    return next();
});

module.exports = router;
