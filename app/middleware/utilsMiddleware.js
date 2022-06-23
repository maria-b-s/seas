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

exports.trimDataValuesAndRemoveSpaces = trimDataValuesAndRemoveSpaces;