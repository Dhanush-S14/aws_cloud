import { useCallback, useRef } from 'react';

export const useTypingEffect = (setTypingMessages) => {
  const typingIntervalRef = useRef(null);

  const startTypingEffect = useCallback((messageId, fullText) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    // Initialize with first character immediately for smooth start
    setTypingMessages(prev => ({
      ...prev,
      [messageId]: {
        displayedText: fullText.substring(0, 1),
        fullText,
        currentIndex: 1,
        isComplete: false
      }
    }));

    let currentIndex = 1; // Start from 1 since we already set the first character
    
    typingIntervalRef.current = setInterval(() => {
      currentIndex += 1;
      
      setTypingMessages(prev => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          displayedText: fullText.substring(0, currentIndex),
          currentIndex,
          isComplete: currentIndex >= fullText.length
        }
      }));

      if (currentIndex >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        
        // Clean up after a delay
        setTimeout(() => {
          setTypingMessages(prev => {
            const newTyping = { ...prev };
            delete newTyping[messageId];
            return newTyping;
          });
        }, 1000);
      }
    }, 20); // Slightly slower for smoother effect
  }, [setTypingMessages]);

  const stopTypingEffect = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setTypingMessages({});
  }, [setTypingMessages]);

  return {
    startTypingEffect,
    stopTypingEffect,
    typingIntervalRef
  };
};