const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validateDriversLicence(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);

  savePageData(req, state);
  const inputCache = loadPageData(req);

  let redirectPath = 'passport';
  const NINO = state['drivers-licence-number'].match(/[^\d]+|\d+/g);

  if(!state['drivers-licence-number'] && state['has-drivers-license'] === 'no'){
    res.render('citizen-application/drivers-licence', { 
      cache: inputCache, 
      validation: {  'drivers-licence-number': 'Enter a driving licence number'  }
    });
    return;
  } else {
    if (disallowedPrefixes.some(el => NINO[0].includes(el))) {
      containsDisallowedPrefix = true;
    } else {
      containsDisallowedPrefix = false;
    }
  }

  if (req.query && req.query.change) {
    redirectPath = 'review-application';
  }
 
  if (state['drivers-licence-number'] && state['has-drivers-license'] === 'yes') {
    if(ninoRegex && !containsDisallowedPrefix){
      res.redirect(redirectPath);
    }
    else {
      res.render('citizen-application/national-insurance-number', { 
        cache: inputCache, 
        validation: {  'drivers-licence-number': 'Enter a driving licence number in the correct format'  }
      });
      
    }
  } 

  else if (state['has-drivers-license'] === 'no') {
    req.session.data['has-drivers-license'] = 'no';
    res.redirect(redirectPath);
  } 
  
  else {
    res.render('citizen-application/national-insurance-number', {
      cache: inputCache,
      validation: {
        'has-drivers-license': 'Please select whether you have a UK National Insurance number'
      }});
  }
}


exports.validateDriversLicence = validateDriversLicence;
