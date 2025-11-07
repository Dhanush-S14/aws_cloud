import { motion, AnimatePresence } from "framer-motion";
import { 
  BotMessageSquare, 
  MessageCircle, 
  AlertCircle, 
  X,
  Sparkles 
} from "lucide-react";
import { MessageBubble } from "./MessageBubble";

export const MessagesContainer = ({
  messages,
  typingMessages,
  apiError,
  rateLimitInfo,
  loading,
  isTyping,
  chatContainerRef,
  copiedMessageId,
  editingMessageId,
  editedText,
  onCopyMessage,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onSetEditedText,
  onOptionSelect,
  formatBoldText,
  messageVariants,
  onSetApiError,
  onSetRateLimitInfo
}) => {
  return (
    <div
      ref={chatContainerRef}
      className="flex-1 p-5 overflow-y-auto space-y-4 relative z-10"
      style={{
        background: "radial-gradient(ellipse at top, rgba(var(--shadow-rgb), 0.03), transparent)",
      }}
    >
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300">{apiError}</p>
            {rateLimitInfo && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Please wait {rateLimitInfo.retryAfter} seconds before trying again.
              </p>
            )}
          </div>
          <button
            onClick={() => {
              onSetApiError && onSetApiError(null);
              onSetRateLimitInfo && onSetRateLimitInfo(null);
            }}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center shimmer-effect"
              style={{
                background: `linear-gradient(135deg, rgba(var(--shadow-rgb), 0.2), rgba(var(--shadow-rgb), 0.05))`,
                boxShadow: `0 0 40px rgba(var(--shadow-rgb), 0.3)`,
              }}
            >
              <BotMessageSquare className="w-12 h-12" style={{ color: "var(--btn)" }} />
            </div>
          </div>
          <div className="text-center space-y-2 px-4">
            <p className="text-2xl font-bold txt glow-text">
              Welcome to EduHaven AI
            </p>
            <p className="txt-dim text-sm">
              Powered by advanced intelligence to help you learn and grow
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center px-4">
            {["Ask a question", "Get help", "Learn something new"].map((text, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full text-xs txt-dim border"
                style={{
                  borderColor: "rgba(var(--shadow-rgb), 0.2)",
                  background: "rgba(var(--shadow-rgb), 0.05)",
                }}
              >
                <MessageCircle className="w-3 h-3 inline mr-1" />
                {text}
              </div>
            ))}
          </div>
        </div>
      ) : (
        messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            custom={index}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className={`flex flex-col message-bubble ${
              msg.type === "user" ? "items-end" : "items-start"
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <MessageBubble
              msg={msg}
              typingMessages={typingMessages}
              copiedMessageId={copiedMessageId}
              editingMessageId={editingMessageId}
              editedText={editedText}
              onCopyMessage={onCopyMessage}
              onEditMessage={onEditMessage}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onSetEditedText={onSetEditedText}
              onOptionSelect={onOptionSelect}
              formatBoldText={formatBoldText}
            />
          </motion.div>
        ))
      )}
      {(loading || isTyping) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-3"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-600">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <div className="p-3 sm:p-4 rounded-2xl rounded-bl-md shadow-md border bg-white dark:bg-gray-800 border-indigo-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full typing-dot"></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking...</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};