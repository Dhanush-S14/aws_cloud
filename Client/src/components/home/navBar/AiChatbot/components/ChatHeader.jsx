import { BotMessageSquare, X, Zap, Trash2, WifiOff } from "lucide-react";

export const ChatHeader = ({ 
  isOnline, 
  messages, 
  showVideoSection, 
  onClearChat, 
  onClose 
}) => {
  return (
    <div
      className="flex justify-between items-center px-4 py-3 border-b backdrop-blur-sm relative z-10"
      style={{
        borderColor: "rgba(var(--shadow-rgb), 0.2)",
        background: "linear-gradient(to right, var(--bg-sec), var(--bg-primary))"
      }}
    >
      <div className="flex items-center gap-3 pl-8">
        <div className="relative">
          <BotMessageSquare className="w-6 h-6 txt" style={{ filter: "drop-shadow(0 0 8px rgba(var(--shadow-rgb), 0.6))" }} />
          <Zap className="w-3 h-3 absolute -top-1 -right-1 txt" style={{ color: "var(--btn)" }} />
        </div>
        <h3 className="text-xl txt font-bold glow-text">EduHaven AI</h3>
        {!isOnline && (
          <div className="flex items-center gap-1 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!showVideoSection && messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="font-medium">Clear</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="p-2 hover:bg-sec rounded-full transition-all duration-200 txt-dim hover:txt hover:rotate-90"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};