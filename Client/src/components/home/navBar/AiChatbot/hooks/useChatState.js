import { useState, useCallback } from 'react';

export const useChatState = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("edu_chat");
    return saved ? JSON.parse(saved) : [];
  });

  const [conversationContext, setConversationContext] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 420, height: 720 });
  const [showVideoSection, setShowVideoSection] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false);

  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [apiError, setApiError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Interactive Guided Experience State
  const [currentExperience, setCurrentExperience] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [experienceAnswers, setExperienceAnswers] = useState({});

  // Typing effect state
  const [typingMessages, setTypingMessages] = useState({});

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationContext([]);
    localStorage.removeItem("edu_chat");
    setShowQuickActions(true);
    setApiError(null);
    // Reset guided experience
    setCurrentExperience(null);
    setCurrentStep(0);
    setExperienceAnswers({});
    // Reset typing effect
    setTypingMessages({});
  }, []);

  const closeModal = useCallback(() => {
    setIsChatOpen(false);
    setShowVideoSection(false);
    setApiError(null);
    setRateLimitInfo(null);
    // Reset guided experience
    setCurrentExperience(null);
    setCurrentStep(0);
    setExperienceAnswers({});
    // Reset typing effect
    setTypingMessages({});
  }, []);

  return {
    messages,
    setMessages,
    conversationContext,
    setConversationContext,
    loading,
    setLoading,
    isChatOpen,
    setIsChatOpen,
    dimensions,
    setDimensions,
    showVideoSection,
    setShowVideoSection,
    showQuickActions,
    setShowQuickActions,
    isQuickActionsExpanded,
    setIsQuickActionsExpanded,
    copiedMessageId,
    setCopiedMessageId,
    editingMessageId,
    setEditingMessageId,
    editedText,
    setEditedText,
    apiError,
    setApiError,
    isOnline,
    setIsOnline,
    isTyping,
    setIsTyping,
    rateLimitInfo,
    setRateLimitInfo,
    currentExperience,
    setCurrentExperience,
    currentStep,
    setCurrentStep,
    experienceAnswers,
    setExperienceAnswers,
    typingMessages,
    setTypingMessages,
    clearChat,
    closeModal
  };
};