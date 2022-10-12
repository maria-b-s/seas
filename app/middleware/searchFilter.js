function searchFilter(req, res) {
    let filtered = req.session.data.filteredApplications.filter(app => {
        return app.name.includes(req.session.data.search);
    });

    req.session.data.filteredApplications = filtered;
}

exports.searchFilter = searchFilter;
