const { trimDataValuesAndRemoveSpaces } = require('./utilsMiddleware');

const REGEX_NINO = new RegExp(/^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/, 'i');


function validateNationalInsurance(req,res, _next) {

  const state = trimDataValuesAndRemoveSpaces(req.body);
  let prevValues = null;

  if (req.session.data['has-national-insurance-number']) {
      prevValues = {
        ["has-national-insurance-number"]: req.session.data['has-national-insurance-number'],
        ["national-insurance-number"]: req.session.data["national-insurance-number"]
      }
  }


  if (state['has-national-insurance-number'] && state['has-national-insurance-number'] === 'yes') {
    if (REGEX_NINO.test(state['referred-nino-input'])) {
      req.session.data["national-insurance-number"] = state['referred-nino-input'];
      res.redirect('drivers-licence');
    } else {
      res.render('citizen-application/national-insurance-number', { 
        cache: prevValues, 
        validation: {  'referred-nino-input': 'Enter a National Insurance number in the correct format'  }
      });
    }
  } else if (state['has-national-insurance-number'] === 'no') {
    req.session.data['has-national-insurance-number'] = 'no';
    res.redirect('drivers-licence');
  } else {
    res.render('citizen-application/national-insurance-number', {
      cache: prevValues,
      validation: {
        'has-national-insurance-number': 'Please select whether you have a UK National Insurance number'
      }});
  }
}


exports.validateNationalInsurance = validateNationalInsurance;