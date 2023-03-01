const { trimDataValuesAndRemoveSpaces, savePageData, loadPageData } = require('./utilsMiddleware');

function validateOrganisation(req, res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);

  savePageData(req, state);
  const inputCache = loadPageData(req);
  let redirectPath = 'applicant-or-post-holder';
  const organisationName = state['organisation-name']
  const validName = /^[a-zA-Z'\- ]+$/.test(req.body['organisation-name']);

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
    dataValidation['organisation-check'] = 'Select which organisation the check is for';
  }
  if(state['organisation-check'] == 'another-org'){
    if(!validName){
      dataValidation['organisation-name'] = 'Name of organisation must only include letters a to z, hyphens, spaces and apostrophes';
    }
    if(organisationName.length > 60){
      dataValidation['organisation-name'] = 'Name of organisation must be 60 characters or fewer';
    }
    if(!organisationName){
      dataValidation['organisation-name'] = 'Enter name of organisation';
    }
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
