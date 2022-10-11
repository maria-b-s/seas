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

  if(!state['email']){
    dataValidation['email'] = 'Enter email address';
  }

  if(!state['confirm-email']){
    dataValidation['confirm-email'] = 'Enter email address';
  }

  if(state['confirm-email'] != state['email']){
    dataValidation['confirm-email'] = 'Enter the correct email address ';
  }

  if(!state['email'].includes('@')){
    dataValidation['email'] = 'Enter email address in correct format';
  }

  if (Object.keys(dataValidation).length) {
    res.render('citizen-application/email-address', { cache: inputCache,   validation: dataValidation });
  } else {
    req.session.data['email'] = state['email'];
    req.session.data['confirm-email'] = state['confirm-email'];
    res.redirect(redirectPath)
  }  

}


exports.validateEmail = validateEmail;
