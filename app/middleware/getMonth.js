function getMonth(req, res) {
    const date = new Date();
    date.setMonth(arguments['0'] - 1);

    return date.toLocaleString([], { month: 'long' });
}

exports.getMonth = getMonth;
