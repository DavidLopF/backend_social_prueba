/**
 * Returns the singular form of a given string.
 *
 * @param str - The input string.
 * @returns The singular form of the input string.
 */
export const getSingular = (str: string): string => {
  if (str.endsWith("es")) {
    return str.slice(0, str.length - 2);
  } else if (str.endsWith("s")) {
    return str.slice(0, str.length - 1);
  } else {
    return str;
  }
};

export const toLowerCase = (obj: any) => {
  const newObj: any = {};
  for (const key in obj) {
    newObj[key.toLowerCase()] = obj[key];
  }
  return newObj;
};
