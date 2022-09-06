


function cancelApplication(req, res) {
  let ref = req.session.data.app;
   
  for(app of req.session.data['applications']){
      if(app.ref == ref){
          app.status.id = '009';
          app.status.text = 'CANCELLED'
      }
  }

  let selectedApplication = req.session.data['applications'].filter(value =>
      value.ref == ref
  )
  
  req.session.data.selectedApplication = selectedApplication;
  res.redirect('application-cancelled');
}



exports.cancelApplication = cancelApplication;