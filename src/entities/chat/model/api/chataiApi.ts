import apiInstance from 'shared/api/apiInstance.ts';

// Function to send message to AI
export const sendMessageToAI = async (
  messageText: string,
  responseFormat: any,
): Promise<void> => {
  try {
    const response = await apiInstance.post('/chat', {
      messageText,
      responseFormat,
    });
    console.log('Response from AI:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI:', error);
  }
};

// Function to send image and prompt to AI
export const sendImageToAI = async (
  prompt: string,
  imageBase64: string,
  responseFormat: any,
): Promise<void> => {
  try {
    const response = await apiInstance.post('/chat/with-image', {
      prompt,
      imageBase64,
      responseFormat,
    });
    console.log('Response from AI:', response.data);
  } catch (error) {
    console.error('Error sending image to AI:', error);
  }
};
