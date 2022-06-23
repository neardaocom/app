import loValues from "lodash/values";

export default class ObjectHelper {
  static compareByText(a: any, b: any): number {
      const nameA = a.text.toUpperCase();
      const nameB = b.text.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
  }
  
  static first(object: any) {
    return (loValues(object) ?? [undefined])[0]
  }

  static toBase64(object: any) {
    return Buffer.from(JSON.stringify(object)).toString('base64')
  }
}