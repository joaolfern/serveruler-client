export function convertMultipleOption<T>(value: T | Array<T>) {
  return Array.isArray(value) ? value.join("-") : value;
}
