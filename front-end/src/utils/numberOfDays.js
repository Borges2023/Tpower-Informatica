const numberOfDays = (date1, date2) =>
  (new Date(date2).getTime() - new Date(date1).getTime()) /
  (60 * 60 * 24 * 1000);

export default numberOfDays;
