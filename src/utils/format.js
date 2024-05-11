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

export function formatDietDataToString(data) {
  let message = '';

  data.forEach(item => {
    message += `${item.time} - ${item.name}\n* ${item.dish} - ${item.dishCalories}\n\n`;
  });

  return message;
}
