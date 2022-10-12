function filterAppList(req, res) {
    let filteredCopy = req.session.data.applications
    let filteredList = [];

    let parameterString = [];

    if (req.session.data.filters['needs-action'] == '_unchecked'  || req.session.data.filters['needs-action'].length == 0) {
        req.session.data.filters['needs-action'] = [];
        req.session.data.needsActionFilter = null;
    } else {
        req.session.data.filters['needs-action'] = ['1', '2'];
        parameterString.push('needs-action')
        req.session.data.needsActionFilter = 'Needs action';
    }

    if (req.session.data.filters['app-status'] == '_unchecked' || req.session.data.filters['app-status'].length == 0) {
        req.session.data.filters['app-status'] = [];
        req.session.data.appStatusFilter = null;
    } else {
        parameterString.push(...req.session.data.filters['app-status'])
        req.session.data.appStatusFilter = req.session.data.filters['app-status'];
    }

    if (req.session.data.filters['organisation'] == '_unchecked' || req.session.data.filters['organisation'].length == 0) {
        req.session.data.filters['organisation'] = [];
        req.session.data.orgFilter = null;
    } else {
        parameterString.push(...req.session.data.filters['organisation'])
        req.session.data.orgFilter = req.session.data.filters['organisation'];
    }

    // Filtering

    if(req.session.data.filters['needs-action'].length == 2){
        filteredCopy = filteredCopy.filter(app => {
            return app.status['id'] < 3;
        });
    }
    if(req.session.data.filters['app-status'].length > 0){
        filteredCopy = filteredCopy.filter(app => req.session.data.filters['app-status'].includes(app.status['id']));
    }
    if(req.session.data.filters['organisation'].length > 0){
        filteredCopy = filteredCopy.filter(app => req.session.data.filters['organisation'].includes(app.organisation));
    }

    filteredList.push(...filteredCopy);
    filteredList = filteredList.filter((value, index, self) => index === self.findIndex(t => t.ref === value.ref));
    req.session.data.filteredApplications = filteredList;
    return parameterString.join('+');
}

exports.filterAppList = filterAppList;
