function getPreviousDate(datetime) {
    const date = new Date(datetime);
    if (date.getHours() < 12) {
      date.setUTCDate(date.getDate() - 1);
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

function parseDate(dateString) {
  const date = new Date(dateString);
  if (date instanceof Date && !isNaN(date)) {
    return date.toISOString().split('T')[0];
  }
  throw new Error('Invalid date format');
}

module.exports = {
  getPreviousDate,
  parseDateTime,
  parseDate
}