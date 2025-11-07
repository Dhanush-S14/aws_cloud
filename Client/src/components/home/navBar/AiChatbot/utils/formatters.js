export const formatBoldText = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<span class="message-bold">$1</span>')
  .replace(/\*(.*?)\*/g, '<em class="message-italic">$1</em>');
};

export const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};