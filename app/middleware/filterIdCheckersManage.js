// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const { savePageData } = require("./utilsMiddleware");



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const filterIdCheckersManage = (request, response) => {
    // Constants.
    const data = request.session.data;
    const redirectPathIdCheckersManage = "id-checkers-manage";

    // Properties.
    let filterClientOrganisation = data["filter-client-organisation"];
    let filterIdCheckerName = data["filter-id-checker-name"];
    let idCheckers = data["id-checkers"];
    let redirectPath = redirectPathIdCheckersManage;

    // Cache session.
    savePageData(request, request.body);

    /* Applies the corresponding filters according to the client organisation
     * selected and/or Identity checker name searched. */ 
    if (filterClientOrganisation && filterIdCheckerName) {
        filterIdCheckerName = filterIdCheckerName.trim().toLowerCase();
        idCheckers = idCheckers.filter(idCheckers => idCheckers["org"] === (filterClientOrganisation));
        data["id-checkers-filtered"] = idCheckers.filter(idCheckers => idCheckers["name"].toLowerCase().includes(filterIdCheckerName));
    } else if (filterClientOrganisation) {
        data["id-checkers-filtered"] = idCheckers.filter(idCheckers => idCheckers["org"] === (filterClientOrganisation));
    } else if (filterIdCheckerName) {
        filterIdCheckerName = filterIdCheckerName.trim().toLowerCase();
        data["id-checkers-filtered"] = idCheckers.filter(idCheckers => idCheckers["name"].toLowerCase().includes(filterIdCheckerName));
    } else {
        data["filter-client-organisation"] = "";
        data["filter-id-checker-name"] = "";
        data["id-checkers-filtered"] = "";
    }

    response.redirect(redirectPath);
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.filterIdCheckersManage = filterIdCheckersManage;