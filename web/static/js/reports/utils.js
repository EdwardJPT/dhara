// web/src/reports/utils.ts
function padList(list, maxLength) {
  const padded = [...list];
  while (padded.length < maxLength) {
    padded.push(null);
  }
  return padded.slice(0, maxLength);
}
function isDateWithinRange(dateStr, start, end, isAllTime) {
  if (isAllTime) return true;
  const dateObj = new Date(dateStr);
  return dateObj >= start && dateObj <= end;
}
function isTimestampWithinRange(timestamp, start, end, isAllTime) {
  if (isAllTime) return true;
  const dateObj = new Date(timestamp * 1e3);
  return dateObj >= start && dateObj <= end;
}
export {
  isDateWithinRange,
  isTimestampWithinRange,
  padList
};
