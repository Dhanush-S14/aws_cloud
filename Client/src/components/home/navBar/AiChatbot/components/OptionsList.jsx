import { motion } from "framer-motion";

export const OptionsList = ({ options, step, onOptionSelect }) => (
  <div className="mt-3 space-y-2">
    <div className="grid grid-cols-1 gap-2">
      {options.map((option, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOptionSelect(option, step)}
          className="w-full px-4 py-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {option}
        </motion.button>
      ))}
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
      Select an option to continue
    </p>
  </div>
);