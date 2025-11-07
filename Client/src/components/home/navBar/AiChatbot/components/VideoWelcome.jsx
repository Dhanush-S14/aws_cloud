import { motion } from "framer-motion";
import { 
  Calendar, 
  Trophy, 
  Code, 
  Users, 
  Star, 
  Clock, 
  TrendingUp, 
  Sparkles 
} from "lucide-react";

export const VideoWelcome = ({ 
  videoRef, 
  onVideoEnd, 
  onStartChat, 
  onNavigate,
  onSetQuestion,
  onSetShowVideoSection,
  onSetShowQuickActions,
  onSetIsQuickActionsExpanded
}) => {
  const trendingFeatures = [
    { name: "Study Sessions", emoji: "📚", users: "1.2K" },
    { name: "AI Notes", emoji: "🤖", users: "2.5K" },
    { name: "Game Learning", emoji: "🎮", users: "1.8K" },
    { name: "Live Classes", emoji: "🎥", users: "3.2K" }
  ];

  return (
    <div
      className="flex flex-col p-3 sm:p-4 overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
      style={{
        flex: '1 1 auto',
        minHeight: '0',
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full opacity-15 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Video Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full mb-3"
      >
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/50 dark:border-gray-700/50 transform hover:scale-[1.02] transition-transform duration-300">
          <video
            ref={videoRef}
            className="w-full h-full object-fill"
            onEnded={onVideoEnd}
            playsInline
            autoPlay
          >
            <source src="/eduhaven-intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"></div>

          {/* Overlay Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="absolute bottom-0 left-0 right-0 p-3 text-white text-center"
          >
            <h3 className="text-base sm:text-lg font-bold mb-0.5 drop-shadow-2xl">
              Welcome to EduHaven! 🎓
            </h3>
            <p className="text-xs opacity-90 drop-shadow-lg">Your learning journey starts here</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Trending Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="mb-3 mt-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-indigo-600 dark:text-indigo-400" />
            Popular Features
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">Active Now</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {trendingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl p-2 border bg-white/80 dark:bg-gray-700/60 border-indigo-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600/60 cursor-pointer transition-all"
              onClick={() => {
                onSetQuestion(`Tell me about ${feature.name}`);
                onSetShowVideoSection(false);
                onSetShowQuickActions(false);
                onSetIsQuickActionsExpanded(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{feature.emoji}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    {feature.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-indigo-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {feature.users}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="flex justify-center items-center mb-3 mt-4 w-full"
      >
        <div className="flex gap-1.5 justify-center items-center flex-nowrap px-2">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-2 py-1.5 shadow-lg text-[10px] xs:text-xs font-medium whitespace-nowrap flex-shrink-0">
            <Calendar className="w-2.5 h-2.5 xs:w-3 xs:h-3 animate-bounce" style={{ animationDuration: '2s' }} />
            <span>50+ Sessions</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-2 py-1.5 shadow-lg text-[10px] xs:text-xs font-medium whitespace-nowrap flex-shrink-0">
            <Trophy className="w-2.5 h-2.5 xs:w-3 xs:h-3 animate-pulse" />
            <span>Learning Games</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full px-2 py-1.5 shadow-lg text-[10px] xs:text-xs font-medium whitespace-nowrap flex-shrink-0">
            <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3 animate-spin" style={{ animationDuration: '3s' }} />
            <span>24/7 Support</span>
          </div>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="grid grid-cols-3 gap-2 mb-3"
      >
        <div 
          className="rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all bg-white/90 dark:bg-gray-700/90 border-indigo-200 dark:border-gray-600 cursor-pointer group"
          onClick={() => onNavigate('/session')}
        >
          <div className="text-2xl mb-0.5 animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }}>
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Sessions</div>
        </div>
        <div 
          className="rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all bg-white/90 dark:bg-gray-700/90 border-indigo-200 dark:border-gray-600 cursor-pointer group"
          onClick={() => onNavigate('/games')}
        >
          <div className="text-2xl mb-0.5 animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }}>
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Games</div>
        </div>
        <div 
          className="rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all bg-white/90 dark:bg-gray-700/90 border-indigo-200 dark:border-gray-600 cursor-pointer group"
          onClick={() => onNavigate('/notes')}
        >
          <div className="text-2xl mb-0.5 animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }}>
            <Code className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-pink-600 dark:text-pink-400" />
          </div>
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Notes</div>
        </div>
      </motion.div>

      {/* Info Text */}
      <div className="text-center mb-3 px-2">
        <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
          ✨ Get personalized learning recommendations instantly! ✨
        </p>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-auto"
      >
        <button
          onClick={onStartChat}
          className="relative w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden group text-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Start Learning Journey</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </span>
        </button>
        <div className="flex items-center justify-center mt-2 space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Join 2,000+ learners
          </p>
        </div>
      </motion.div>
    </div>
  );
};