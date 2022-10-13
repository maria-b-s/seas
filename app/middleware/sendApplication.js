function sendApplication(req, res) {
    let ref = req.session.data.app;
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

    for (app of req.session.data['applications']) {
        if (app.ref == ref) {
            app.status.id = '4';
            app.status.text = 'Submitted to DBS';
        }
    }

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == ref);
    selectedApplication[0]['worklog'].unshift({
        action: 'Submitted application to DBS',
        date: `${date}/${month}/${year}`,
        time: strTime,
        person: req.session.data['name-of-verifier'],
    });

    req.session.data.selectedApplication = selectedApplication;
    req.session.data.filteredApplications = req.session.data.applications;

    if (req.url == '/confirm-cancel') {
        res.redirect('back');
    } else {
        res.redirect('application-cancelled');
    }
}

exports.sendApplication = sendApplication;
