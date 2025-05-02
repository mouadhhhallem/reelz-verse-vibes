
/**
 * Initializes theme and UI preferences from localStorage
 */
export const initializeThemePreferences = () => {
  // Load hologram preference
  const hologramEnabled = localStorage.getItem('hologramEnabled');
  if (hologramEnabled === 'false') {
    document.body.classList.remove('hologram-enabled');
  } else {
    // Default to enabled
    document.body.classList.add('hologram-enabled');
    if (hologramEnabled === null) {
      localStorage.setItem('hologramEnabled', 'true');
    }
  }
  
  // Load reduced motion preference
  const reduceMotion = localStorage.getItem('reduceMotion');
  if (reduceMotion === 'true') {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
  
  // Load high contrast preference
  const highContrast = localStorage.getItem('highContrast');
  if (highContrast === 'true') {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
  
  // Load language preference
  const language = localStorage.getItem('appLanguage');
  if (!language) {
    localStorage.setItem('appLanguage', 'english');
  }
  
  return {
    hologramEnabled: hologramEnabled !== 'false',
    reduceMotion: reduceMotion === 'true',
    highContrast: highContrast === 'true',
    language: language || 'english'
  };
};
