// Type definitions for TypeScript (optional)
export const MessageTypes = {
  USER: 'user',
  AI: 'ai'
};

export const ExperienceTypes = {
  STUDY_PLANNING: 'study planning',
  SESSION_BOOKING: 'session booking',
  NOTE_TAKING: 'note taking'
};

// PropTypes for React (if not using TypeScript)
export const MessagePropTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['user', 'ai']).isRequired,
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  edited: PropTypes.bool,
  isGuided: PropTypes.bool,
  step: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.string)
};

export const GuidedExperiencePropTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired
  })).isRequired,
  finalResponse: PropTypes.func.isRequired
};