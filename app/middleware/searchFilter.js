function searchFilter(req, res) {
    let filtered = req.session.data.filteredApplications.filter(app => {
        return app.name.toLowerCase().includes(req.session.data.search.toLowerCase());
    });

    req.session.data.filteredApplications = filtered;
}

exports.searchFilter = searchFilter;
