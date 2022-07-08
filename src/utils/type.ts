export const isJson = (str: string): boolean => {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}