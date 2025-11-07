import { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  BotMessageSquare,
  X,
  ArrowUp,
  Loader,
  Spline,
  Trash2,
  Sparkles,
  Zap,
  MessageCircle,
  Calendar,
  Trophy,
  Code,
  Users,
  Star,
  Clock,
  TrendingUp,
  Send,
  Copy,
  Check,
  Edit2,
  AlertCircle,
  WifiOff,
  Square,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Import modular components and hooks
import { useChatState } from "./hooks/useChatState";
import { useApi } from "./hooks/useApi";
import { useTypingEffect } from "./hooks/useTypingEffect";
import { useResizable } from "./hooks/useResizable";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { ChatHeader } from "./components/ChatHeader";
import { VideoWelcome } from "./components/VideoWelcome";
import { MessagesContainer } from "./components/MessagesContainer";
import { InputArea } from "./components/InputArea";
import { QuickActionsMenu } from "./components/QuickActions";
import { OptionsList } from "./components/OptionsList";

import { GUIDED_EXPERIENCES, HARDCODED_RESPONSES, QUICK_ACTIONS, TRENDING_FEATURES } from "./utils/constants";
import { formatBoldText, formatTime } from "./utils/formatters";
import { debounce, getHardcodedResponse } from "./utils/helpers";

import "./styles/animations.css";

const apikey = import.meta.env.VITE_GEMINI_KEY;

// Variants for the chat panel
const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// Variants for each chat message
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const AiChatbot = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  // Use custom hooks for state management
  const {
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
  } = useChatState();

  const { startTypingEffect, stopTypingEffect, typingIntervalRef } = useTypingEffect(setTypingMessages);
  const { resizing, startPos, startDimensions, handleMouseDown, handleMouseMove, handleMouseUp } = useResizable(dimensions, setDimensions);
  const { saveMessages, loadMessages, clearMessages } = useLocalStorage();

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages, saveMessages]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]);

  useEffect(() => {
    const modalEl = document.getElementById("my_modal_1");
    if (modalEl) {
      modalEl.showModal = () => {
        setIsChatOpen(true);
        setShowVideoSection(true);
      };
      modalEl.close = () => {
        closeModal();
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      };
    }
  }, [setIsChatOpen, setShowVideoSection, closeModal, typingIntervalRef]);

  // scroll chat to end - but respect user scrolling during typing
  useEffect(() => {
    if (isChatOpen && chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      
      // Don't auto-scroll during typing effects
      const isTypingEffectRunning = Object.keys(typingMessages).length > 0;
      
      if (!isTypingEffectRunning) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [isChatOpen, messages, typingMessages]);

  // Separate effect for when typing completes
  useEffect(() => {
    if (isChatOpen && chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage && lastMessage.type === "ai") {
        const typingState = typingMessages[lastMessage.id];
        
        // Scroll when typing completes
        if (typingState && typingState.isComplete) {
          setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }, 100);
        }
      }
    }
  }, [typingMessages, isChatOpen, messages]);

  useEffect(() => {
    if (isChatOpen && !showVideoSection && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen, showVideoSection]);

  const debouncedAction = useCallback((action, delay = 500) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      action();
    }, delay);
  }, []);

  // Start a guided experience
  const startGuidedExperience = (experienceKey) => {
    setCurrentExperience(experienceKey);
    setCurrentStep(0);
    setExperienceAnswers({});
    
    const experience = GUIDED_EXPERIENCES[experienceKey];
    const currentStepData = experience.steps[0];
    
    const guidedMessage = {
      id: Date.now(),
      type: "ai",
      text: `🎯 **${experienceKey.charAt(0).toUpperCase() + experienceKey.slice(1)} Setup**\n\n${currentStepData.question}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isGuided: true,
      step: 0,
      options: currentStepData.options
    };
    
    setMessages(prev => [...prev, guidedMessage]);
  };

  // Handle option selection in guided experience
  const handleOptionSelect = (option, stepIndex) => {
    const experience = GUIDED_EXPERIENCES[currentExperience];
    const currentStepData = experience.steps[stepIndex];
    
    // Save answer
    setExperienceAnswers(prev => ({
      ...prev,
      [currentStepData.type]: option
    }));
    
    // Add user's selection to messages
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: option,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Check if there are more steps
    if (stepIndex < experience.steps.length - 1) {
      // Move to next step
      const nextStep = stepIndex + 1;
      setCurrentStep(nextStep);
      
      const nextStepData = experience.steps[nextStep];
      
      setTimeout(() => {
        const nextMessage = {
          id: Date.now() + 1,
          type: "ai",
          text: nextStepData.question,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isGuided: true,
          step: nextStep,
          options: nextStepData.options
        };
        
        setMessages(prev => [...prev, nextMessage]);
      }, 500);
    } else {
      // Final step - show summary
      setCurrentExperience(null);
      setCurrentStep(0);
      
      setTimeout(() => {
        const finalResponse = experience.finalResponse({
          ...experienceAnswers,
          [currentStepData.type]: option
        });
        
        const finalMessage = {
          id: Date.now() + 1,
          type: "ai",
          text: finalResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        
        setMessages(prev => [...prev, finalMessage]);
        setConversationContext(prev => [
          ...prev,
          { role: "assistant", text: finalResponse }
        ].slice(-10));
      }, 500);
    }
  };

  const { generateResponse } = useApi(setMessages, setConversationContext, setLoading, startTypingEffect);

  const generateQuestion = async (customQuestion = null) => {
    const questionToAsk = customQuestion || question;

    if (!questionToAsk.trim()) {
      return;
    }

    if (!isOnline) {
      setApiError("You are offline. Please check your internet connection.");
      return;
    }

    setLoading(true);
    setIsTyping(true);
    setApiError(null);

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: questionToAsk,
      time: currentTime
    };

    setMessages((prev) => [...prev, userMessage]);

    // Check for hardcoded response or guided experience first
    const response = getHardcodedResponse(questionToAsk, GUIDED_EXPERIENCES, HARDCODED_RESPONSES);
    
    if (response) {
      if (response.type === 'guided') {
        // Start guided experience
        setTimeout(() => {
          startGuidedExperience(response.experience);
          setLoading(false);
          setIsTyping(false);
          setQuestion("");
          setShowQuickActions(false);
          setIsQuickActionsExpanded(false);
        }, 1000);
        return;
      } else if (response.type === 'hardcoded') {
        // Use hardcoded response with typing effect
        setTimeout(() => {
          const aiMessageId = Date.now() + 1;
          const aiMessage = {
            id: aiMessageId,
            type: "ai",
            text: response.response,
            time: currentTime,
          };
          
          setMessages((prev) => [...prev, aiMessage]);
          setConversationContext(prev => [
            ...prev,
            { role: "assistant", text: response.response }
          ].slice(-10));
          
          // Start typing effect for hardcoded response
          startTypingEffect(aiMessageId, response.response);
          
          setLoading(false);
          setIsTyping(false);
          setQuestion("");
          setShowQuickActions(false);
          setIsQuickActionsExpanded(false);
        }, 500);
        return;
      }
    }

    // Use AI model for other queries
    const updatedContext = [
      ...conversationContext,
      { role: "user", text: questionToAsk }
    ].slice(-10);
    setConversationContext(updatedContext);

    const contextPrompt = updatedContext.length > 1
      ? `You are EduHaven AI, an intelligent learning assistant for the EduHaven educational platform. 
      
Context of previous conversation:
${updatedContext.slice(0, -1).map(msg => `${msg.role}: ${msg.text}`).join('\n')}

Current question: ${questionToAsk}

EduHaven Platform Features:
- Study Sessions (group, 1-on-1, exam prep, topic deep dives)
- Learning Games (educational games, quizzes, tournaments)
- AI Notes (smart note-taking, flashcards, summarization)
- Progress Tracking and Analytics
- Collaborative Learning Tools

Please provide helpful, educational responses focused on learning, studying, and using the EduHaven platform. If the question is unrelated to education or learning, gently guide the conversation back to how EduHaven can help with learning goals.`
      : `You are EduHaven AI, an intelligent learning assistant for the EduHaven educational platform. 

EduHaven Platform Features:
- Study Sessions (group, 1-on-1, exam prep, topic deep dives)
- Learning Games (educational games, quizzes, tournaments)  
- AI Notes (smart note-taking, flashcards, summarization)
- Progress Tracking and Analytics
- Collaborative Learning Tools

Please provide helpful, educational responses focused on learning, studying, and using the EduHaven platform. If the question is unrelated to education or learning, gently guide the conversation back to how EduHaven can help with learning goals.

Current question: ${questionToAsk}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: contextPrompt }],
              },
            ],
          }),
        }
      );

      if (response.status === 429) {
        setRateLimitInfo({
          message: "Rate limit reached. Please wait a moment before trying again.",
          retryAfter: 60,
        });
        throw new Error("Rate limit exceeded");
      }

      const data = await response.json();

      if (data && data.candidates && data.candidates.length > 0) {
        const generatedResponse =
          data.candidates[0]?.content?.parts[0]?.text || "I apologize, but I couldn't generate a response. Please try again or ask about EduHaven's learning features!";
        
        // Create AI message
        const aiMessageId = Date.now() + 1;
        const aiMessage = {
          id: aiMessageId,
          type: "ai",
          text: generatedResponse,
          time: currentTime,
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setLoading(false);
        setIsTyping(false);
        
        // Start typing effect for AI response
        startTypingEffect(aiMessageId, generatedResponse);

        setConversationContext(prev => [
          ...prev,
          { role: "assistant", text: generatedResponse }
        ].slice(-10));
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setApiError(
        error.message === "Rate limit exceeded"
          ? "Too many requests. Please wait a moment before trying again."
          : "Failed to get response from AI. Please try again."
      );
      setLoading(false);
      setIsTyping(false);
    } finally {
      setQuestion("");
      setShowQuickActions(false);
      setIsQuickActionsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      debouncedAction(() => generateQuestion(), 300);
    }
  };

  const handleStartChat = () => {
    setShowVideoSection(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleVideoEnd = () => {
    setShowVideoSection(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleCopyMessage = (messageText, messageId) => {
    navigator.clipboard.writeText(messageText).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const handleEditMessage = (messageId, messageText) => {
    setEditingMessageId(messageId);
    setEditedText(messageText);
  };

  const saveEditedMessage = () => {
    if (!editedText.trim()) return;

    const messageIndex = messages.findIndex(msg => msg.id === editingMessageId);
    if (messageIndex === -1) return;

    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      text: editedText,
      edited: true,
    };

    const messagesToRemove = messages.slice(messageIndex + 1);
    const finalMessages = updatedMessages.slice(0, messageIndex + 1);

    setMessages(finalMessages);
    setEditingMessageId(null);
    setEditedText("");

    if (updatedMessages[messageIndex].type === "user") {
      generateQuestion(editedText);
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditedText("");
  };

  const stopGeneration = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    
    setLoading(false);
    setIsTyping(false);
    
    // Add "Stopped" message
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const stoppedMessage = {
      id: Date.now() + 1,
      type: "ai",
      text: "Whoa, stop! That wasn't what you were expecting, was it?",
      time: currentTime,
    };
    
    setMessages(prev => [...prev, stoppedMessage]);
    setConversationContext(prev => [
      ...prev,
      { role: "assistant", text: "Whoa, stop! That wasn't what you were expecting, was it?" }
    ].slice(-10));
    
    // Clear any ongoing typing effects
    setTypingMessages({});
  };

  // Attach mouse move and up event listeners for resizing
  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [resizing, handleMouseMove, handleMouseUp]);

  return (
    <div id="manishai">
      {/* Ask AI Button - Using original Button component with new styles */}
      <div className="ai-btn-wrapper">
        <Button
          size="lg"
          variant="default"
          className="ai-ask-btn shadow-[0_4px_100px_rgba(176,71,255,0.7)] font-semibold hover:shadow-[0_4px_100px_rgba(176,71,255,1)] flex items-center gap-3"
          onClick={() => {
            const modalEl = document.getElementById("my_modal_1");
            modalEl && modalEl.showModal();
          }}
        >
          <BotMessageSquare />
          Ask AI
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>

      {/* Chat Panel: render into document.body via portal so close is reliable */}
      {ReactDOM.createPortal(
        <div
          // overlay container
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            pointerEvents: isChatOpen ? "auto" : "none",
          }}
        >
          {/* overlay: clicking outside closes */}
          <div
            onClick={() => setIsChatOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: isChatOpen ? "rgba(0,0,0,0.4)" : "transparent",
              backdropFilter: isChatOpen ? "blur(4px)" : "none",
              transition: "all 300ms",
            }}
          />

          <motion.div
            id="my_modal_1"
            variants={panelVariants}
            initial="hidden"
            animate={isChatOpen ? "visible" : "hidden"}
            exit="hidden"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: dimensions.width,
              height: dimensions.height,
            }}
            onClick={(e) => e.stopPropagation()}
            key="ai-portal-panel"
          >
            <div
              className="chat-panel-wrapper bg-primary rounded-3xl w-full h-full txt flex flex-col overflow-hidden relative"
              style={{
                boxShadow: `0 20px 60px rgba(var(--shadow-rgb), 0.5), 0 0 100px rgba(var(--shadow-rgb), 0.2)`,
                border: "1px solid rgba(var(--shadow-rgb), 0.2)",
              }}
            >
              <div className="video-grid-bg"></div>

              {/* Particles */}
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>

              {/* Resizer handle using the Spline icon */}
              <div
                onMouseDown={handleMouseDown}
                className="absolute top-2 left-2 p-2 cursor-nw-resize z-50 hover:bg-sec rounded-lg transition-all duration-200"
                style={{
                  background: "rgba(var(--shadow-rgb), 0.1)",
                }}
              >
                <Spline className="w-5 h-5 txt-dim" />
              </div>

              <ChatHeader
                isOnline={isOnline}
                messages={messages}
                showVideoSection={showVideoSection}
                onClearChat={clearChat}
                onClose={closeModal}
              />

              {/* Video/Welcome Section */}
              {showVideoSection && (
                <VideoWelcome
                  videoRef={videoRef}
                  onVideoEnd={handleVideoEnd}
                  onStartChat={handleStartChat}
                  onNavigate={navigate}
                  onSetQuestion={setQuestion}
                  onSetShowVideoSection={setShowVideoSection}
                  onSetShowQuickActions={setShowQuickActions}
                  onSetIsQuickActionsExpanded={setIsQuickActionsExpanded}
                />
              )}

              {/* Messages Container */}
              {!showVideoSection && (
                <>
                  <MessagesContainer
                    messages={messages}
                    typingMessages={typingMessages}
                    apiError={apiError}
                    rateLimitInfo={rateLimitInfo}
                    loading={loading}
                    isTyping={isTyping}
                    chatContainerRef={chatContainerRef}
                    copiedMessageId={copiedMessageId}
                    editingMessageId={editingMessageId}
                    editedText={editedText}
                    onCopyMessage={handleCopyMessage}
                    onEditMessage={handleEditMessage}
                    onSaveEdit={saveEditedMessage}
                    onCancelEdit={cancelEdit}
                    onSetEditedText={setEditedText}
                    onOptionSelect={handleOptionSelect}
                    formatBoldText={formatBoldText}
                    messageVariants={messageVariants}
                  />

                  {/* Initial Quick Actions */}
                  <AnimatePresence>
                    {showQuickActions && messages.length <= 1 && (
                      <motion.div
                        initial={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                          <div className="flex flex-col space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
                              Quick Actions
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {QUICK_ACTIONS.map((action, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 + index * 0.1 }}
                                  whileHover={{ 
                                    scale: 1.02,
                                    backgroundColor: "rgba(99, 102, 241, 0.1)"
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    debouncedAction(() => {
                                      setQuestion(action.query);
                                      setTimeout(() => {
                                        generateQuestion();
                                        setShowQuickActions(false);
                                      }, 100);
                                    }, 200);
                                  }}
                                  className="px-3 py-2.5 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 text-left break-words min-h-[44px] flex items-center"
                                >
                                  {action.label}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <InputArea
                    question={question}
                    setQuestion={setQuestion}
                    loading={loading}
                    isOnline={isOnline}
                    currentExperience={currentExperience}
                    showQuickActions={showQuickActions}
                    isQuickActionsExpanded={isQuickActionsExpanded}
                    quickActions={QUICK_ACTIONS}
                    inputRef={inputRef}
                    onGenerateQuestion={generateQuestion}
                    onStopGeneration={stopGeneration}
                    onSetIsQuickActionsExpanded={setIsQuickActionsExpanded}
                    typingMessages={typingMessages}
                    isTyping={isTyping}
                    onKeyDown={handleKeyDown}
                    debouncedAction={debouncedAction}
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AiChatbot;