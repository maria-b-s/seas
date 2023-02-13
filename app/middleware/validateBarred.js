const { savePageData, loadPageData } = require('./utilsMiddleware');

const cms = {
  generalContent: {
      continue: "Continue",
  }
};

function validateBarred(req, res){
  savePageData(req, req.body);
  const inputCache = loadPageData(req);
  let validation = null;

  let url = req.route.path;
  let selected = req.session.data.selected

  if(url == '/enhanced/barred-list-adults'){
    if (!req.body['barred-adults']) {

      validation = {
        'barred-adults': 'Select yes if you are entitled to know if the applicant is barred from working with adults'
      }
  
      res.render('registered-body/enhanced/barred-list-adults',  { cms, cache: inputCache, validation: validation });
    } else {
        req.session.data['barred-adults'] = req.body['barred-adults'];
        if(req.session.data['workforce-selected'] == 'Other'){
          res.redirect('/registered-body/position');
        } else {
          res.redirect('/registered-body/enhanced/working-at-home-address');
        }
    }
  } else {
    if (!req.body['barred-children']) {

      validation = {
        'barred-children': 'Select yes if you are entitled to know if the applicant is barred from working with children'
      }
  
      res.render('registered-body/enhanced/barred-list-children',  { cms, cache: inputCache, validation: validation });
    } else {
        req.session.data['barred-children'] = req.body['barred-children'];

        if(selected == 'Child'){
            res.redirect('/registered-body/enhanced/working-at-home-address');
        } else {
            res.redirect('/registered-body/enhanced/barred-list-adults');
        }
    }
  }

}

exports.validateBarred = validateBarred;
