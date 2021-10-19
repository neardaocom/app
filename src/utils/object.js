export const compareByText = (a, b) => {
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