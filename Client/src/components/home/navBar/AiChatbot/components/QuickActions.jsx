import { motion } from "framer-motion";
import { X } from "lucide-react";

export const QuickActionsMenu = ({ quickActions, onActionClick, onClose }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        Quick Actions
      </p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {quickActions.map((action, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onActionClick(action.query);
          }}
          className="px-3 py-2.5 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 text-left break-words min-h-[44px] flex items-center"
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  </div>
);