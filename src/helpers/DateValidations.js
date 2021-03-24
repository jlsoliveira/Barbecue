import { parse, isDate } from "date-fns";

export const parseDateString = (value, originalValue) => {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
};
