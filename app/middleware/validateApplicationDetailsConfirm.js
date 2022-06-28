
const validateApplicationDetailsConfirm = (req, res) => {

  const currentSelection = req.session.data.selectedApplicationToCancel;

if (req.body['confirmCancel'] === 'cancel') {
    const updatedCollection = req.session.data.applications.filter((el) => el.ref !== currentSelection.ref);
    req.session.data.applications = updatedCollection;
    req.session.data.selectedApplicationToCancel = undefined;
  }
  res.redirect('/dashboard/home');

}

exports.validateApplicationDetailsConfirm = validateApplicationDetailsConfirm;
