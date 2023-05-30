// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const filterIdcApplications = (request, response) => {
    // Constants.
    const data = request.session.data;
    const idcApplications = data["idc-applications"];
    const redirectPathDashboard = "dashboard";

    // Properties.
    let filterApplicantName = data["filter-applicant-name"];
    let redirectPath = redirectPathDashboard;

    // Cache session.
    savePageData(request, request.body);

    /* Applies the corresponding filter according to the applicant name
     * searched. */
    if (filterApplicantName) {
        filterApplicantName = filterApplicantName.trim().toLowerCase();
        data["idc-applications-filtered"] = idcApplications.filter(idcApplication => (filterApplicantName.includes(idcApplication["firstName"].toLowerCase()) || idcApplication["firstName"].toLowerCase().includes(filterApplicantName) ||
                                                                                      filterApplicantName.includes(idcApplication["surname"].toLowerCase()) || idcApplication["surname"].toLowerCase().includes(filterApplicantName)));
    } else {
        data["filter-applicant-name"] = "";
        data["idc-applications-filtered"] = "";
    }
    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.filterIdcApplications = filterIdcApplications;