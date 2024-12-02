import axios from 'axios';

interface SendMessageType {
  messageText: string;
  responseFormat: any;
}

export const sendMessage_v2 = async ({
  messageText,
  responseFormat,
}: SendMessageType): Promise<string> => {
  try {
    const response = await axios.post('http://localhost:3000/api/chat', {
      messageText,
      responseFormat,
    });
    const aiResponse = response.data.aiResponse;
    console.log('AI Response:', aiResponse);
    return aiResponse;
  } catch (error) {
    console.error('Error sending message:', error);
    return 'Error sending message';
  }
};
