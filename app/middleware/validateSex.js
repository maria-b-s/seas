


function validateSex(req, res) {
  if (req.body['sex']) {
    req.session.data.sex = req.body['sex'];
    res.redirect('national-insurance-number');
  } else {
    res.render('citizen-application/sex', { validation: "Please select your birth given sex" });
  }
}



exports.validateSex = validateSex;