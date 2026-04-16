/**
 * Validates username according to requirements:
 * - Lowercase a-z, 0-9, underscore, dot
 * - Length 3-20 characters
 * @param {string} username 
 * @returns {boolean} true if valid
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }

  // Check length
  if (username.length < 3 || username.length > 20) {
    return false;
  }

  // Check allowed characters: lowercase a-z, 0-9, underscore, dot
  const usernameRegex = /^[a-z0-9_.]+$/;
  return usernameRegex.test(username);
}

const RESERVED_USERNAMES = new Set([
  "admin",
  "login",
  "auth",
  "forgotpassword",
  "resetpassword",
  "welcome",
  "home",
  "profile",
  "search",
  "connections",
]);

function normalizeUsername(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
}

export function isReservedUsername(username) {
  const normalized = normalizeUsername(username);
  return RESERVED_USERNAMES.has(normalized);
}

/**
 * Generates username suggestions based on user's name
 * @param {string} fullName 
 * @returns {string[]} array of suggested usernames
 */
export function generateUsernameSuggestions(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return [];
  }

  const names = fullName.toLowerCase().split(' ').filter(n => n.length > 0);
  const suggestions = [];
  
  if (names.length >= 2) {
    const firstName = names[0];
    const lastName = names[names.length - 1];
    
    // firstname.lastname
    suggestions.push(`${firstName}.${lastName}`);
    
    // firstname_lastname
    suggestions.push(`${firstName}_${lastName}`);
    
    // firstname + random number
    suggestions.push(`${firstName}${Math.floor(Math.random() * 1000)}`);
    
    // flastname
    suggestions.push(`${firstName[0]}${lastName}`);
    
    // firstname_lastname + random
    suggestions.push(`${firstName}_${lastName}${Math.floor(Math.random() * 100)}`);
  } else if (names.length === 1) {
    const name = names[0];
    
    // name + random
    suggestions.push(`${name}${Math.floor(Math.random() * 1000)}`);
    
    // name + random 2-digit
    suggestions.push(`${name}${Math.floor(Math.random() * 100)}`);
  }

  // Filter valid usernames and return first 5
  return suggestions
    .filter((u) => validateUsername(u) && !isReservedUsername(u))
    .slice(0, 5);
}
