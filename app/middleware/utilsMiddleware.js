const SANITIZE_NL_RETURN_TABS_REGEX = new RegExp(/\n|\r|\t/, 'g');
const SANITIZE_SPACES_REGEX = new RegExp(/\s\s+/, 'g');

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

/* Persists query string properties from a received HTTP request for a given 
 * path. */
const persistQueryStringFromRequestForPath = (request, path) => {
    // Constants.
    const queryStringIndex = request.originalUrl.indexOf("?");
    const rawQueryString = (queryStringIndex >= 0) ? request.originalUrl.slice(queryStringIndex): "";

    /* Remove any existing query string properties from the given path and
     * persist those from the received HTTP request. */
    path = path.split("?")[0] + rawQueryString;

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

exports.invalidateCache = invalidateCache;
exports.loadPageData = loadPageData;
exports.persistQueryStringFromRequestForPath = persistQueryStringFromRequestForPath;
exports.savePageData = savePageData;
exports.trimDataValuesAndRemoveSpaces = trimDataValuesAndRemoveSpaces;