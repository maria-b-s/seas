function cancelApplication(req, res) {
    let ref = req.session.data.app;

    for (app of req.session.data['applications']) {
        if (app.ref == ref) {
            app.status.id = '5';
            app.status.text = 'Cancelled';
        }
    }

    let selectedApplication = req.session.data['applications'].filter(value => value.ref == ref);

    req.session.data.selectedApplication = selectedApplication;
    req.session.data.filteredApplications = req.session.data.applications;

    if (req.url == '/confirm-cancel') {
        res.redirect('back');
    } else {
        res.redirect('application-cancelled');
    }
}

exports.cancelApplication = cancelApplication;
