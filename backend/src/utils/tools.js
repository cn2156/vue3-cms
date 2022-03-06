/**
 * 获得对象属性的值
 * @param {Object} obj 数据
 * @param {String} prop 属性
 * @param {Number|String} value 值
 * @returns {Number|String}
 */
export const getObjectPropertyValue = (obj, prop, value) => {
  let val;
  for (let item in obj) {
    if (obj[item].value === value) {
      val = obj[item][prop];
      break;
    }
  }
  return val;
};

/**
 * 获得对象的所有属性和值
 * @param {Object} obj 数据
 * @returns {Object}
 */
export const getObjectProperties = (obj, prop = "value") => {
  let properties = {};
  for (let item in obj) {
    properties[item] = obj[item][prop];
  }
  return properties;
};

/**
 * 获得对象的值对应属性
 * @param {Object} obj 数据
 * @param {String} prop 属性
 * @returns {Object}
 */
export const getObjectValueProperties = (obj, prop) => {
  let properties = {};
  for (let item in obj) {
    properties[obj[item].value] = obj[item][prop];
  }
  return properties;
};
