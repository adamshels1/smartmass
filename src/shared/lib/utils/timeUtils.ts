export const getCurrentTime = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = minutes < 30 ? '00' : '30';
  return `${now.getHours()}:${roundedMinutes}`;
};
