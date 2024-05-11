export const jsonParse = text => {
  try {
    text = text.replaceAll('```json', '').replaceAll('```', '');
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};
