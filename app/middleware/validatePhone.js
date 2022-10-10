const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validatePhone(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);
  savePageData(req, state);
  const inputCache = loadPageData(req);
  let dataValidation = {}


  const phoneNumbersOnly = /^[0-9]+$/.test(state['phone-number']);
  let redirectPath = 'review-application';

  // if (req.query && req.query.change) {
  //   redirectPath = 'review-application';
  // }

  if(state['wants-text'] == 'no'){
    req.session.data['phone-number'] = null;
    req.session.data['phone-country'] = null;
    req.session.data['wants-text'] = state['wants-text'];
    res.redirect(redirectPath)
  }
  
  if(!state['wants-text']){
    dataValidation['wants-text'] = 'Select an option';
  }

  if(!phoneNumbersOnly && state['wants-text'] == 'yes'){
    dataValidation['phone-number'] = 'Enter valid mobile number';
  }

  if(!state['phone-country'] && state['wants-text'] == 'yes'){
    dataValidation['phone-country'] = 'Enter country the mobile number is registered to';
  }

  if (Object.keys(dataValidation).length) {
    res.render('citizen-application/telephone-number', { cache: inputCache,   validation: dataValidation });
  } else {
    req.session.data['phone-number'] = state['phone-number'];
    req.session.data['wants-text'] = state['wants-text'];
    res.redirect(redirectPath)
  }  

  
}


exports.validatePhone = validatePhone;
