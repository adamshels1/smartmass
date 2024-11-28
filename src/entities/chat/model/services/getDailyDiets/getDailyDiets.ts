import {sendMessage_v2} from 'entities/chat/model/services/sendMessage_v2.ts';
import {dietsPrompt} from 'entities/chat/model/types/promt.ts';

export const getDailyDiets = async () => {
  const result = await sendMessage_v2({
    messageText:
      'Дай рацион питания на целый день для 3 приемов пищи, общие калории должны быть равны 3000 ккал',
    responseFormat: dietsPrompt,
  });
  return result;
};
