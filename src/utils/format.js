export const jsonParse = text => {
  try {
    // Удаляем управляющие символы из текста
    text = text
      .replaceAll('```json', '')
      .replaceAll('```JSON', '')
      .replaceAll('```', '')
      .replace(/[\u0000-\u001F]/g, '')
      .replace('},]', '}]');
    return JSON.parse(text);
  } catch (error) {
    console.log('error jsonParse', error);
    return null;
  }
};
