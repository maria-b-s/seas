function addApplication(req, res) {
    let app = req.session.data;

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

    req.session.data.newRef = 'RAND123';
    let org = '';

    if (app['organisation-check'] == 'another-org') {
        org = app['organisation-name'];
    } else {
        org = req.session.mockDBaccounts.filter(acc => acc['rbNumber'] == app['registered-body-nr'])[0]['organisation'];
    }

    let newApp = {
        ref: 'RAND123',
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
        children_or_adults: '',
        worklog: [
            {
                action: 'Sent to applicant',
                date: `${date}/${month}/${year}`,
                time: strTime,
                person: req.session.mockDBaccounts.filter(acc => acc['rbNumber'] == app['registered-body-nr'])[0]['email'],
            },
        ],
    };

    req.session.data.applications.push(newApp);
    res.redirect('application-sent-to-citizen');
}

exports.addApplication = addApplication;
