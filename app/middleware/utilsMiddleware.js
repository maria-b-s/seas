const SANITIZE_NL_RETURN_TABS_REGEX = new RegExp(/\n|\r|\t/, 'g');
const SANITIZE_SPACES_REGEX = new RegExp(/\s\s+/, 'g');

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

function invalidateCache(req,res,next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

function savePageData(req, data, withCache = false) {
  const urlOfPage = req.originalUrl.split('?')[0];
  console.log(urlOfPage);
  if (Object.keys(data).length > 0) {
    let dataPayload = { ...data };

    if (withCache && req.session[urlOfPage]) {
      dataPayload = { ...req.session[urlOfPage], ...dataPayload };
    }

    req.session[urlOfPage] = dataPayload;
  }
}

function loadPageData(req) {
  const urlOfPage = req.originalUrl.split('?')[0];
  return req.session[urlOfPage];
}

exports.trimDataValuesAndRemoveSpaces = trimDataValuesAndRemoveSpaces;
exports.invalidateCache = invalidateCache;
exports.savePageData = savePageData;
exports.loadPageData = loadPageData;