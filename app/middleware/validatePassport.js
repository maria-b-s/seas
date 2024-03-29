const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validatePassport(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);
  savePageData(req, state);
  const inputCache = loadPageData(req);
  let dataValidation = {}
  const validCountry = /^[a-zA-Z'\- ]+$/.test(state['passport-country-of-issue']);
  const validPassport = /^[a-zA-Z0-9]+$/.test(state['passport-number']);
  let redirectPath = 'place-of-birth';

  if (req.query && req.query.change) {
    redirectPath = 'review-application';
  }

  if(state['has-passport'] == 'no'){
    req.session.data['passport-number'] = null;
    req.session.data['passport-country-of-issue'] = null;
    req.session.data['has-passport'] = state['has-passport'];
    res.redirect(redirectPath)
  }
  
  if(state['has-passport'] == 'yes'){
    if(!validPassport){
      dataValidation['passport-number'] = 'Passport number must only include letters a to z and numbers';
    }
    if(!validCountry){
      dataValidation['passport-country-of-issue'] = 'Country of issue must only include letters a to z, hyphens, spaces and apostrophes';
    }
    if(!state['passport-country-of-issue']){
      dataValidation['passport-country-of-issue'] = 'Enter country of issue';
    }
    if(!state['passport-number']){
      dataValidation['passport-number'] = 'Enter passport number';
    }
  }

  if(!state['has-passport']){
    dataValidation['has-passport'] = 'Select if you have a passport';
  }

  if (Object.keys(dataValidation).length) {
    res.render('citizen-application/passport', { cache: inputCache,   validation: dataValidation });
  } else {
    req.session.data['passport-number'] = state['passport-number'];
    req.session.data['has-passport'] = state['has-passport'];
    res.redirect(redirectPath)
  }  

  
}


exports.validatePassport = validatePassport;
