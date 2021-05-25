/** Check if the object is empty. */
export const isEmpty = (object: Object) => object && Object.keys(object).length ? false : true
export default isEmpty