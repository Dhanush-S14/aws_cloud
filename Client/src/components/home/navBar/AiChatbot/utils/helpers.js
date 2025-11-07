export const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const getHardcodedResponse = (query, GUIDED_EXPERIENCES, HARDCODED_RESPONSES) => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for guided experience triggers
  if (normalizedQuery.includes('study plan') || normalizedQuery.includes('learning plan') || normalizedQuery.includes('create study schedule')) {
    return { type: 'guided', experience: 'study planning' };
  }
  
  if (normalizedQuery.includes('book session') || normalizedQuery.includes('schedule session') || normalizedQuery.includes('join session')) {
    return { type: 'guided', experience: 'session booking' };
  }
  
  if (normalizedQuery.includes('setup notes') || normalizedQuery.includes('create notes') || normalizedQuery.includes('note system')) {
    return { type: 'guided', experience: 'note taking' };
  }
  
  // Exact matches for quick actions
  const exactMatches = {
    "show me study sessions": HARDCODED_RESPONSES["show me study sessions"],
    "how do i join learning games": HARDCODED_RESPONSES["how do i join learning games"],
    "how can i create study notes": HARDCODED_RESPONSES["how can i create study notes"],
    "i need help with learning": HARDCODED_RESPONSES["i need help with learning"],
  };
  
  if (exactMatches[normalizedQuery]) {
    return { type: 'hardcoded', response: exactMatches[normalizedQuery] };
  }
  
  // Keyword matches for general queries
  if (normalizedQuery.includes('who are you') || normalizedQuery.includes('what are you')) {
    return { type: 'hardcoded', response: HARDCODED_RESPONSES["who are you"] };
  }
  
  if (normalizedQuery.includes('about') && (normalizedQuery.includes('eduhaven') || normalizedQuery.length < 20)) {
    return { type: 'hardcoded', response: HARDCODED_RESPONSES["about"] };
  }
  
  if (normalizedQuery.includes('what is eduhaven') || normalizedQuery.includes('tell me about eduhaven')) {
    return { type: 'hardcoded', response: HARDCODED_RESPONSES["what is eduhaven"] };
  }
  
  return null;
};

export const generateMessageId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};