const validateApplicationDetails = (req, res) => {

  let confirmCancel = false;

  const validation = {};
  const currentSelection = req.session.data.selectedApplicationToCancel;

  if (req.query['confirm-cancel']) {
      confirmCancel = true;
  }

  if (!req.body['radio-group-confirm-cancel']) {
    validation['radio-group-confirm-cancel'] = 'Select whether you want to cancel the application';
    res.render('dashboard/details', {data: req.session.data.selectedApplicationToCancel, confirmCancel, validation });
  } else if (req.body['radio-group-confirm-cancel'] === '1') {
    const updatedCollection = req.session.data.applications.filter((el) => el.ref !== currentSelection.ref);
    req.session.data.applications = updatedCollection;
    req.session.data.selectedApplicationToCancel = undefined;
    res.redirect('/dashboard/home');
  } else {
    res.redirect('/dashboard/details');
  }


}

exports.validateApplicationDetails = validateApplicationDetails;
