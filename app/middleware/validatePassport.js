const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validatePassport(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);
  savePageData(req, state);
  const inputCache = loadPageData(req);
  let dataValidation = {}

  const passportNumbersOnly = /^[0-9]+$/.test(state['passport-number']);
  let redirectPath = 'place-of-birth';

  if (req.query && req.query.change) {
    redirectPath = 'review-application';
  }

  if(state['has-passport'] == 'no'){
    req.session.data['passport-number'] = null;
    req.session.data['has-passport'] = null;
    req.session.data['has-passport'] = state['has-passport'];
    res.redirect(redirectPath)
  }

  if((!passportNumbersOnly || state['passport-number'].length !== 9) && state['has-passport'] == 'yes'){
    dataValidation['passport-number'] = 'Enter valid passport number';
  }

  if(!state['passport-country-of-issue'] && state['has-passport'] == 'yes'){
    dataValidation['passport-country-of-issue'] = 'Enter country of issue';
  }

  if (Object.keys(dataValidation).length) {
    res.render('citizen-application/passport', { cache: inputCache,   validation: dataValidation });
  } else {
    req.session.data['passport-number'] = state['passport-number'];
    req.session.data['has-passport'] = state['has-passport'];
    req.session.data['passport-country-of-issue'] = state['passport-country-of-issue'];
    res.redirect(redirectPath)
  }  

  
}


exports.validatePassport = validatePassport;
