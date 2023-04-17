// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const _PREDEFINED_DEACTIVATED_ID_CHECKER = {
    dateAdded: "01/01/2023",
    dept: "Student Applications",
    email: "lionelhutz@example.org",
    mobile: "07987 654321",
    name: "Lionel Hutz",
    org: "Penny Lane College of PE",
    password: undefined
};



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const activateAndSelectDeactivatedIdChecker = (request) => {
    // Constants.
    const data = request.session.data;

    /* Activates the deactivated ID checker by adding to the array of known ID
     * checkers. */
    data["id-checkers"].push({
        dateAdded: _PREDEFINED_DEACTIVATED_ID_CHECKER.dateAdded,
        dept: _PREDEFINED_DEACTIVATED_ID_CHECKER.dept,
        email: _PREDEFINED_DEACTIVATED_ID_CHECKER.email,
        mobile: _PREDEFINED_DEACTIVATED_ID_CHECKER.mobile,
        name: _PREDEFINED_DEACTIVATED_ID_CHECKER.name,
        org: _PREDEFINED_DEACTIVATED_ID_CHECKER.org,
        password: data["deactivated-id-checker-password"]
    });

    // Selects the now activated ID Checker for use within /dashboard.
    request.session.selectedIDC = data["id-checkers"].at(-1);
};

const clearDeactivatedIdCheckerPassword = (request) => {
    // Constants.
    const data = request.session.data;

    // Clears any password associated to the predefined deactivated ID Checker.
    data["deactivated-id-checker-password"] = "";
    data["deactivated-id-checker-password-confirm"] = "";
};

const clearSelectedIdChecker = (request) => {
    /* Clears any current ID Checker currently selected to ensure the activate
     * account flow can be followed through. */
    request.session.selectedIDC = undefined;
};

const setPredefinedDeactivatedIdChecker = (request) => {
    // Constants.
    const data = request.session.data;

    /* Ensures a predefined deactivated ID Checker details are available; these
     * details would have identified via a unique email URL. */
    data["deactivated-id-checker-date-added"] = data["deactivated-id-checker-date-added"] ?? _PREDEFINED_DEACTIVATED_ID_CHECKER.dateAdded;
    data["deactivated-id-checker-dept"] = data["deactivated-id-checker-dept"] ?? _PREDEFINED_DEACTIVATED_ID_CHECKER.dept;
    data["deactivated-id-checker-email"] = data["deactivated-id-checker-email"] ?? _PREDEFINED_DEACTIVATED_ID_CHECKER.email;
    data["deactivated-id-checker-mobile"] = data["deactivated-id-checker-mobile"] ?? _PREDEFINED_DEACTIVATED_ID_CHECKER.mobile;
    data["deactivated-id-checker-name"] = data["deactivated-id-checker-name"] ?? _PREDEFINED_DEACTIVATED_ID_CHECKER.name;
    data["deactivated-id-checker-org"] = data["deactivated-id-checker-org"] ?? _PREDEFINED_DEACTIVATED_ID_CHECKER.org;
    data["deactivated-id-checker-password"] = data["deactivated-id-checker-password"] ?? _PREDEFINED_DEACTIVATED_ID_CHECKER.password;
};



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.activateAndSelectDeactivatedIdChecker = activateAndSelectDeactivatedIdChecker;
exports.clearDeactivatedIdCheckerPassword = clearDeactivatedIdCheckerPassword;
exports.clearSelectedIdChecker = clearSelectedIdChecker;
exports.setPredefinedDeactivatedIdChecker = setPredefinedDeactivatedIdChecker;