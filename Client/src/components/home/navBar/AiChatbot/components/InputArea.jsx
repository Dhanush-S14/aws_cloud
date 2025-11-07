import { motion, AnimatePresence } from "framer-motion";
import { Send, Square, Sparkles, X } from "lucide-react";
import { QuickActionsMenu } from "./QuickActions";

export const InputArea = ({
  question,
  setQuestion,
  loading,
  isOnline,
  currentExperience,
  showQuickActions,
  isQuickActionsExpanded,
  quickActions,
  inputRef,
  onGenerateQuestion,
  onStopGeneration,
  onSetIsQuickActionsExpanded,
  typingMessages,
  isTyping,
  onKeyDown,
  debouncedAction
}) => {
  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        {/* Quick Actions Menu Button - Only show when collapsed */}
        {!showQuickActions && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onSetIsQuickActionsExpanded(!isQuickActionsExpanded)}
            className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}
        
        <textarea
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about learning, sessions, notes..."
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all resize-none overflow-hidden"
          style={{
            minHeight: '44px',
            maxHeight: '80px',
          }}
          onInput={(e) => {
            const target = e.target;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 80) + 'px';
          }}
          disabled={loading || !isOnline || currentExperience}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (loading || isTyping || Object.keys(typingMessages).length > 0) {
              onStopGeneration();
            } else {
              debouncedAction(() => onGenerateQuestion(), 300);
            }
          }}
          disabled={(!question.trim() && !(loading || isTyping || Object.keys(typingMessages).length > 0)) || !isOnline || currentExperience}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex-shrink-0 ${
            loading || isTyping || Object.keys(typingMessages).length > 0
              ? "bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-500 dark:to-pink-500"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500"
          }`}
        >
          {loading || isTyping || Object.keys(typingMessages).length > 0 ? (
            <Square className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </motion.button>
      </div>
      
      {/* Expanded Quick Actions Menu */}
      <AnimatePresence>
        {isQuickActionsExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <QuickActionsMenu 
              quickActions={quickActions}
              onActionClick={(query) => {
                debouncedAction(() => {
                  setQuestion(query);
                  setTimeout(onGenerateQuestion, 100);
                  onSetIsQuickActionsExpanded(false);
                }, 200);
              }}
              onClose={() => onSetIsQuickActionsExpanded(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="text-xs mt-3 text-center flex items-center justify-center space-x-1 text-gray-400 dark:text-gray-500">
        <Sparkles className="w-3 h-3" />
        <span>Press Enter to send • Shift+Enter for new line</span>
      </div>
    </div>
  );
};