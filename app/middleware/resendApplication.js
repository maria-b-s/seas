const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function resendApplication(req, res) {
    const state = trimDataValuesAndRemoveSpaces(req.body);
    savePageData(req, state);
    const inputCache = loadPageData(req);
    let ref = req.session.data.app;
    let dataValidation = {};
    
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

    if (!req.body['new-email']) {
        dataValidation['new-email'] = 'Select an option';
    }

    if (req.body['new-email'] == "No" && !req.body['new-email-address']) {
        dataValidation['new-email-address'] = 'Enter an email address';
    }

    if(req.body['new-email'] == "No" && !req.body['new-email-address'].includes('@')){
        dataValidation['new-email-address'] = 'Enter the email address in the correct format, like name@example.com';
      }

    if (Object.keys(dataValidation).length) {
        res.render('registered-body/resend-application', { cache: inputCache, validation: dataValidation });
    } else {
        let selectedApplication = req.session.data['applications'].filter(value => value.ref == ref);
   
        if(req.body['new-email'] == "No"){
            selectedApplication[0]['email'] = req.body['new-email-address']
        }
        
        selectedApplication[0]['history'].unshift({
            action: 'Resent application',
            date: `${date}/${month}/${year}`,
            time: strTime,
            person: req.session.mockDBaccounts.filter(acc => acc['rbNumber'] == req.session.data['registered-body-nr'])[0]['email'],
        });

        req.session.data.selectedApplication = selectedApplication;
        req.session.data.filteredApplications = req.session.data.applications;
        res.redirect('/registered-body/resend-confirm?app=' + ref);
    }
}

exports.resendApplication = resendApplication;
