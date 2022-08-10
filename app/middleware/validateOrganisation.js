const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validateOrganisation(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);

  savePageData(req, state);
  const inputCache = loadPageData(req);
  let redirectPath = 'applicant-or-post-holder';
  const organisationName = state['organisation-name']
  let dataValidation = {}
  
  if (req.query && req.query.change) {
    redirectPath = 'check-answers';
  }

  if(state['organisation-check'] == 'my-org'){
    req.session.data['organisation-name'] = null;
    req.session.data['organisation-check'] = state['organisation-check'];
    res.redirect(redirectPath)
  }
  
  if(!state['organisation-check']){
    dataValidation['organisation-check'] = 'Select an option';
  }

  if(!organisationName && state['organisation-check'] == 'another-org'){
    dataValidation['organisation-name'] = 'Enter organisation name';
  }

  if (Object.keys(dataValidation).length) {
    res.render('registered-body/organisation-name', { cache: inputCache,   validation: dataValidation });
  } else {
    req.session.data['organisation-name'] =  state['organisation-name'];
    req.session.data['organisation-check'] = state['organisation-check'];
    res.redirect(redirectPath)
  }  
}


exports.validateOrganisation = validateOrganisation;
