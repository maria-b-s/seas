const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validateDriversLicence(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);

  savePageData(req, state);
  const inputCache = loadPageData(req);

  let redirectPath = 'passport';
  const driversLicence = state['drivers-licence-number'].match(/[^\d]+|\d+/g);
  const licenseMatchesRegex = /^^[A-Z9]{5}\d{6}[A-Z9]{2}\d[A-Z]{2}$$/.test(state['drivers-licence-number'])
  let dataValidation = {}
  
  if (req.query && req.query.change) {
    redirectPath = 'review-application';
  }

  if(state['has-drivers-license'] == 'no'){
    req.session.data['drivers-licence-number'] = null;
    req.session.data['has-drivers-license'] = state['has-drivers-license'];
    res.redirect(redirectPath)
  }
  
  if(!state['has-drivers-license']){
    dataValidation['has-drivers-license'] = 'Select yes if you have a current UK driving licence';
  }

  if(!state['has-drivers-license'] && !state['drivers-licence-number']){
    dataValidation['has-drivers-license'] = 'Enter your driving licence number';
  }

  if(!licenseMatchesRegex && state['has-drivers-license'] == 'yes'){
    dataValidation['drivers-licence-number'] = 'Driving licence number must only include letters a to z and numbers';
  }

  if (Object.keys(dataValidation).length) {
    res.render('citizen-application/drivers-licence', { cache: inputCache,   validation: dataValidation });
  } else {
    req.session.data['drivers-licence-number'] = state['drivers-licence-number'];
    req.session.data['has-drivers-license'] = state['has-drivers-license'];
    res.redirect(redirectPath)
  }  
}


exports.validateDriversLicence = validateDriversLicence;
