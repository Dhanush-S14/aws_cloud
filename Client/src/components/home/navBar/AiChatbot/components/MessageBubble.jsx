import { motion } from "framer-motion";
import { Copy, Check, Edit2 } from "lucide-react";
import { OptionsList } from "./OptionsList";

export const MessageBubble = ({ 
  msg, 
  typingMessages, 
  copiedMessageId, 
  editingMessageId, 
  editedText,
  onCopyMessage,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onSetEditedText,
  onOptionSelect 
}) => {
  const formatBoldText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<span class="message-bold">$1</span>')
    .replace(/\*(.*?)\*/g, '<em class="message-italic">$1</em>');
  };

  if (editingMessageId === msg.id) {
    return (
      <div className="w-full max-w-[85%] space-y-2">
        <textarea
          value={editedText}
          onChange={(e) => onSetEditedText(e.target.value)}
          className="w-full p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancelEdit}
            className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSaveEdit}
            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative group">
        <div
          className={`py-3 px-4 rounded-2xl max-w-[85%] ${
            msg.type === "user"
              ? "gradient-border shimmer-effect"
              : "bg-sec"
          }`}
          style={
            msg.type === "user"
              ? {
                  background: `linear-gradient(135deg, rgba(var(--shadow-rgb), 0.15), rgba(var(--shadow-rgb), 0.05))`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 4px 15px rgba(var(--shadow-rgb), 0.2)`,
                }
              : {
                  boxShadow: `0 2px 10px rgba(0, 0, 0, 0.1)`,
                }
          }
        >
          <div className="message-content">
            {msg.type === "ai" && typingMessages[msg.id] ? (
              <p 
                className="txt leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: formatBoldText(typingMessages[msg.id].displayedText) + 
                          (!typingMessages[msg.id].isComplete ? '<span class="typing-cursor"></span>' : '')
                }}
              />
            ) : (
              <p 
                className="txt leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatBoldText(msg.text) }}
              />
            )}
          </div>
          {msg.edited && (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic mt-1 block">
              (edited)
            </span>
          )}
          
          {/* Guided Experience Options */}
          {msg.isGuided && msg.options && (
            <OptionsList 
              options={msg.options} 
              step={msg.step}
              onOptionSelect={onOptionSelect}
            />
          )}
        </div>
        <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-8">
          {msg.type === "ai" && !msg.isGuided && (!typingMessages[msg.id] || typingMessages[msg.id]?.isComplete) && (
            <button
              onClick={() => onCopyMessage(msg.text, msg.id)}
              className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              title="Copy message"
            >
              {copiedMessageId === msg.id ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
          {msg.type === "user" && (
            <button
              onClick={() => onEditMessage(msg.id, msg.text)}
              className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              title="Edit message"
            >
              <Edit2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
      <span
        className="text-xs txt-dim mt-1.5 font-medium"
        style={{ opacity: 0.7 }}
      >
        {msg.time}
      </span>
    </>
  );
};