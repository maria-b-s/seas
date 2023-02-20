function addApplication(req, res) {
    let app = req.session.data;

    function createRef() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 9; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Date
    let currentDate = new Date();
    let date = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    if (date < 10) {
        date = '0' + date;
    }
    if (month < 10) {
        month = '0' + month;
    }
    const year = currentDate.getFullYear();

    // Time
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    //Reset Unused Values
    if (app['what-dbs-check'] != 'Enhanced with barred list') {
        app['barred-children'] = null;
        app['barred-adults'] = null;
        app['children-or-adults'] = null;
    }

    if (app['what-dbs-check'] == 'Enhanced with barred list' && app['workforce-selected'] == 'Adult') {
        app['barred-adults'] = null;
    }

    if (app['what-dbs-check'] == 'Enhanced with barred list' && app['workforce-selected'] == 'Child') {
        app['barred-children'] = null;
    }

    if (app['organisation-check'] == 'my-org') {
        app['organisation-name'] = null;
    }

    if (app['what-application-type'] == 'Volunteer') {
        app['rechecked'] = null;
    }

    //Reference Number
    app['ref'] = createRef();
    let existingReference = true;
    while (existingReference == true) {
        let existingRef = req.session.data.applications.filter(acc => acc['ref'] == app['ref']);
        if (existingRef.length > 0) {
            app['ref'] = createRef();
        } else {
            existingReference = false;
        }
    }

    if (app['organisation-check'] == 'another-org') {
        org = app['organisation-name'];
    } else {
        org = req.session.mockDBaccounts.filter(acc => acc['rbNumber'] == app['registered-body-nr'])[0]['organisation'];
    }

    let newApp = {
        ref: app['ref'],
        name: app['first-name'] + ' ' + app['last-name'],
        firstName: app['first-name'],
        middleName: '',
        surname: app['last-name'],
        status: { id: '3', text: 'Sent to applicant' },
        type: app['what-dbs-check'],
        date: `${date}/${month}/${year}`,
        email: app['applicant-email'],
        prevNames: [],
        dob: '',
        sex: '',
        nino: '',
        licence: '',
        passport: '',
        passportCountry: '',
        nationality: '',
        addressTown: '',
        addressCountry: '',
        address: [],
        changedAddress: '',
        previous_addresses: [],
        phoneNumber: '',
        previousConvictions: '',
        organisation: org,
        position: app['position-name'],
        appType: app['what-application-type'],
        workforce: app['workforce-selected'],
        children_or_adults: app['children-or-adults'],
        barredAdult: app['barred-adults'],
        barredChildren: app['barred-children'],
        history: [
            {
                action: 'Sent to applicant',
                date: `${date}/${month}/${year}`,
                time: strTime,
                person: req.session.mockDBaccounts.filter(acc => acc['rbNumber'] == app['registered-body-nr'])[0]['email'],
            },
        ],
    };

    req.session.data.applications.push(newApp);
    req.session.data.newRef = app['ref'];
    req.session.data.submittedEmail = app['applicant-email'];

    // Clear form data
    for (var key of Object.keys(req.session.data)) {
        if (
            key == 'appStatus' ||
            key == 'organisations' ||
            key == 'applications' ||
            key == 'filteredApplications' ||
            key == 'registered-body-nr' ||
            key == 'counter-signatory-nr' ||
            key == 'newRef' ||
            key == 'submittedEmail'
        ) {
        } else {
            req.session.data[key] = null;
        }
    }

    res.redirect('application-sent-to-citizen');
}

exports.addApplication = addApplication;
