import { useCallback } from 'react';

export const useLocalStorage = () => {
  const saveMessages = useCallback((messages) => {
    localStorage.setItem("edu_chat", JSON.stringify(messages));
  }, []);

  const loadMessages = useCallback(() => {
    const saved = localStorage.getItem("edu_chat");
    return saved ? JSON.parse(saved) : [];
  }, []);

  const clearMessages = useCallback(() => {
    localStorage.removeItem("edu_chat");
  }, []);

  return {
    saveMessages,
    loadMessages,
    clearMessages
  };
};