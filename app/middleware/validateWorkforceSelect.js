const { savePageData, loadPageData } = require('./utilsMiddleware');

const cms = {
  generalContent: {
      continue: "Continue",
  }
};

function validateWorkforceSelect(req, res){
  savePageData(req, req.body);
  const inputCache = loadPageData(req);
  let validation = null;

  if (!req.body['radio-group-workforce-select']) {

    validation = {
      'radio-group-workforce-select': 'Select which workforce the applicant will be working in'
    }

    res.render('registered-body/enhanced/workforce-select',  { cms, cache: inputCache, validation: validation });
  } else {
    req.session.data['workforce-selected'] = req.body['radio-group-workforce-select'];
    // Standard Route
    if(req._parsedOriginalUrl.path == '/registered-body/workforce-select'){
      res.redirect('/registered-body/position');
    } 
    // Enhanced Route
    else {
      if(req.session.data['workforce-selected'] == 'Adult'){
        res.redirect('/registered-body/enhanced/barred-list-adults');
      } else {
        res.redirect(`/registered-body/enhanced/barred-list-children?selected=${req.session.data['workforce-selected']}`);
      } 
    }
  }

}

exports.validateWorkforceSelect = validateWorkforceSelect;
