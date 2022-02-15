import loValues from "lodash/values";

export const compareByText = (a: any, b: any) => {
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

export const first = (object: any) => {
  return (loValues(object) ?? [undefined])[0]
}