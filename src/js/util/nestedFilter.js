export default function nestedFilter(targetArray, filters) {
  var filterKeys = Object.keys(filters);
  return targetArray.filter(function(eachObj) {
    return filterKeys.every(function(eachKey) {
      if (!filters[eachKey].length) {
        return true;
      }
      let incidents = eachObj.filter(victim => filters[eachKey].includes(victim[eachKey]) && victim[eachKey] !== "")
      return incidents.length > 0
    });
  });
};
