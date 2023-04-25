// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
const crypto = require("crypto");



// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const SANITIZE_NL_RETURN_TABS_REGEX = new RegExp(/\n|\r|\t/, 'g');
const SANITIZE_SPACES_REGEX = new RegExp(/\s\s+/, 'g');



// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
const getEncryptedPassword = () => {
    // Constants.
    const hash = crypto.createHash("sha256");

    // Properties.
    let password = process.env.PASSWORD;

    // Encrypts the password for use in authentication cookie.
    if (password) {
        hash.update(password);
        password = hash.digest("hex");
    }
    return password;
};

function invalidateCache(req,res,next) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate,  proxy-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

function loadPageData(req) {
    const urlOfPage = req.originalUrl.split('?')[0];

    if (req.session.cache) {
    return req.session.cache[urlOfPage];
    } 
    return null;
}

const persistChangeQueryStringFromRequestForPath = (request, path) => {
    // Constants.
    const changeQueryString = "?change=true";
    const queryStringIndex = request.originalUrl.indexOf("?");
    const rawQueryString = (queryStringIndex >= 0) ? request.originalUrl.slice(queryStringIndex): "";

    /* Persist any existing query string property of "change=true" for the
     * received HTTP request. */
    if (rawQueryString.includes(changeQueryString)) {
        path = path.split("?")[0] + changeQueryString;
    }
    return path;
};

function savePageData(req, data, withCache = false) {
const urlOfPage = req.originalUrl.split('?')[0];

if (!req.session.cache) {
    req.session.cache = {};
}

if (Object.keys(data).length > 0) {
    let dataPayload = { ...data };

    if (withCache && req.session.cache[urlOfPage]) {
    dataPayload = { ...req.session.cache[urlOfPage], ...dataPayload };
    }

    req.session.cache[urlOfPage] = dataPayload;
}
}

function trimDataValuesAndRemoveSpaces(data) {
    Object.keys(data).forEach((el) => {
    if (typeof data[el] === 'string') {
        data[el] = data[el]
        .trim()
        .replace(SANITIZE_NL_RETURN_TABS_REGEX, ' ')
        .replace(SANITIZE_SPACES_REGEX, ' ')
        .split(' ')
        .join('');
    }
    });
    return data;
}



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
exports.getEncryptedPassword = getEncryptedPassword;
exports.invalidateCache = invalidateCache;
exports.loadPageData = loadPageData;
exports.persistChangeQueryStringFromRequestForPath = persistChangeQueryStringFromRequestForPath;
exports.savePageData = savePageData;
exports.trimDataValuesAndRemoveSpaces = trimDataValuesAndRemoveSpaces;