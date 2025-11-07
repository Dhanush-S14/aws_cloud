export const validateQuestion = (question) => {
  if (!question || question.trim().length === 0) {
    return { isValid: false, error: "Question cannot be empty" };
  }
  
  if (question.trim().length > 1000) {
    return { isValid: false, error: "Question is too long" };
  }
  
  return { isValid: true, error: null };
};

export const validateMessage = (message) => {
  if (!message || typeof message !== 'object') {
    return { isValid: false, error: "Invalid message format" };
  }
  
  if (!message.id || !message.type || !message.text) {
    return { isValid: false, error: "Message missing required fields" };
  }
  
  return { isValid: true, error: null };
};