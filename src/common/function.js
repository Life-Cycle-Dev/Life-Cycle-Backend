function getPreviousDate(datetimeMillisec) {
    const date = new Date(datetimeMillisec);
    if (date.getHours() < 12) {
      date.setDate(date.getDate() - 1);
    }
    return date.toISOString().split('T')[0];
}

function parseDateTime(dateString) {
  const date = new Date(dateString);
  if (date instanceof Date && !isNaN(date)) {
    return date;
  }
  throw new Error('Invalid date format');
}

module.exports = {
  getPreviousDate,
  parseDateTime
}