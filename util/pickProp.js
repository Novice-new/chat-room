module.exports = function (obj, ...props) {
  const newObj = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if (props.includes(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}