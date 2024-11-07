export default function filterObjectsByDate(objects) {
  const today = new Date();
  const todayMonth = today.getMonth(); // getMonth() returns month from 0-11
  const todayDay = today.getDate(); // getDate() returns day of the month from 1-31

  return objects.filter((obj) => {
    const d = new Date(obj.date);
    const month = d.getMonth();
    const day = d.getDate();

    // Check if the date's month and day are on or before today's month and day
    return month < todayMonth || (month === todayMonth && day <= todayDay);
  });
}
