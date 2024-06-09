export const jsonParse = text => {
  try {
    // Удаляем управляющие символы из текста
    text = text
      .replaceAll('```json', '')
      .replaceAll('```JSON', '')
      .replaceAll('```', '')
      .replaceAll('\\"', '')
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
    message += `${item?.time} - ${item?.name}\n* ${item.dish} - ${item?.dishCalories}\n\n`;
  });

  return message;
}

export function sumAmountByName(products) {
  const sumMap = {};

  console.log('products', products);

  if (!products?.length || (products?.length && !products[0]?.name)) {
    return null;
  }
  for (const product of products) {
    const {name, amount, units} = product;
    const key = name + '|' + units; // Создаем уникальный ключ из имени и единиц измерения

    // Если продукт с таким ключом уже есть в объекте, прибавляем к нему значение amount
    if (sumMap.hasOwnProperty(key)) {
      sumMap[key] += parseFloat(amount);
    } else {
      sumMap[key] = parseFloat(amount);
    }
  }

  // Преобразуем объект обратно в массив объектов
  const result = Object.keys(sumMap).map(key => {
    const [name, units] = key.split('|'); // Разделяем ключ на имя и единицы измерения
    return {name, amount: sumMap[key].toFixed(0), units};
  });

  return result;
}
