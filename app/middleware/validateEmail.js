const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validateEmail(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);

  savePageData(req, state);
  const inputCache = loadPageData(req);

  let redirectPath = 'telephone-number';
  let dataValidation = {}

  if (req.query && req.query.change) {
    redirectPath = 'review-application';
  }

  if(!state["applicant-email"]){
    dataValidation["applicant-email"] = 'Enter an email address';
  }

  if(!state["applicant-email-confirm"]){
    dataValidation["applicant-email-confirm"] = 'Enter an email address';
  }

  if(state["applicant-email-confirm"] != state["applicant-email"]){
    dataValidation["applicant-email-confirm"] = 'Enter the correct email address ';
  }

  if(!state["applicant-email"].includes('@')){
    dataValidation["applicant-email"] = 'Enter the email address in the correct format, like name@example.com';
  }

  if (Object.keys(dataValidation).length) {
    res.render('citizen-application/email-address', { cache: inputCache,   validation: dataValidation });
  } else {
    req.session.data["applicant-email"] = state["applicant-email"];
    req.session.data["applicant-email-confirm"] = state["applicant-email-confirm"];
    res.redirect(redirectPath)
  }  

}


exports.validateEmail = validateEmail;
