import {GoogleGenerativeAI} from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyDk_JN-D7ToR5acTN6oQ8S6VkOoEYbawIM');

export interface SendMessageType {
  messageText: string;
  responseFormat: any;
}
export const sendMessage_v2 = async ({
  messageText,
  responseFormat,
}: SendMessageType) => {
  try {
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    const result = await model.generateContent(
      JSON.stringify({prompt: messageText, responseFormat}),
    );
    const response = await result.response;
    let text = response.text();
    console.log('response.text', text);
    return text;
  } catch (error) {
    console.error('Error sending message:', error);
    return '';
  }
};
