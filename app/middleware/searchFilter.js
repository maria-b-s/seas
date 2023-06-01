function searchFilter(req, res) {
    let filtered = req.session.data.filteredApplications.filter(app => {
        let result = false;
        try {
            result = app.name.toLowerCase().includes(req.session.data.search.toLowerCase());
        } finally {}
        return result;
    });

    req.session.data.filteredApplications = filtered;
}

exports.searchFilter = searchFilter;
