const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validateNationalInsurance(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);

  savePageData(req, state);
  const inputCache = loadPageData(req);

  let redirectPath = 'drivers-licence';
  const NINO = state['referred-nino-input'].match(/[^\d]+|\d+/g);
  const ninoRegex = state['referred-nino-input'].match(/^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i);
  const disallowedPrefixes = ['BG', 'GB', 'KN', 'NK', 'NT', 'TN', 'ZZ'];
  let containsDisallowedPrefix = false;


  if(!state['referred-nino-input'] && state['has-national-insurance-number'] === 'yes'){
    res.render('citizen-application/national-insurance-number', { 
      cache: inputCache, 
      validation: {  'referred-nino-input': 'Enter a National Insurance number'  }
    });
    return;
  } 

  if (req.query && req.query.change) {
    redirectPath = 'review-application';
  }
 
  if (state['referred-nino-input'] && state['has-national-insurance-number'] === 'yes') {
    if (disallowedPrefixes.some(el => NINO[0].includes(el))) {
      containsDisallowedPrefix = true;
    } else {
      containsDisallowedPrefix = false;
    }

    if(ninoRegex && !containsDisallowedPrefix){
      req.session.data['referred-nino-input'] = state['referred-nino-input'];
      res.redirect(redirectPath);
    }
    else {
      res.render('citizen-application/national-insurance-number', { 
        cache: inputCache, 
        validation: {  'referred-nino-input': 'National Insurance number must only include letters a to z and numbers'  }
      });
      
    }
  } 

  else if (state['has-national-insurance-number'] === 'no') {
    req.session.data['has-national-insurance-number'] = 'no';
    res.redirect(redirectPath);
  } 
  
  else {
    res.render('citizen-application/national-insurance-number', {
      cache: inputCache,
      validation: {
        'has-national-insurance-number': 'Select yes if you have a UK National Insurance number'
      }});
  }
}


exports.validateNationalInsurance = validateNationalInsurance;
