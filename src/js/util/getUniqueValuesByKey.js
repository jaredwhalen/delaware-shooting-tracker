export default function getUniqueValuesByKey(data, key) {
  return data.map( (value) => value[key]).filter( (value, index, _arr) => _arr.indexOf(value) == index)
}
