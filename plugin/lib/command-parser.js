/**
 * Robust shell command parser for security plugins
 * Handles quotes, paths, subshells, and command chaining
 */

/**
 * Extract the base executable name from a path or command
 * Examples:
 *   /usr/bin/git -> git
 *   ./scripts/deploy.sh -> deploy.sh
 *   "git" -> git
 */
function extractExecutableName(token) {
  if (!token) return '';
  
  // Remove quotes (single, double, backticks)
  let cleaned = token.replace(/^["'`]+|["'`]+$/g, '');
  
  // Extract basename from path
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    cleaned = parts[parts.length - 1];
  }
  
  // Remove Windows backslashes
  if (cleaned.includes('\\')) {
    const parts = cleaned.split('\\');
    cleaned = parts[parts.length - 1];
  }
  
  return cleaned.toLowerCase();
}

/**
 * Parse a shell command into tokens, handling quotes and special characters
 * This is a simplified parser that handles common cases
 */
function tokenizeCommand(commandString) {
  const tokens = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let escaped = false;
  
  for (let i = 0; i < commandString.length; i++) {
    const char = commandString[i];
    
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    
    if (char === '\\') {
      escaped = true;
      current += char;
      continue;
    }
    
    // Handle quotes
    if (char === "'" && !inDoubleQuote && !inBacktick) {
      inSingleQuote = !inSingleQuote;
      current += char;
      continue;
    }
    
    if (char === '"' && !inSingleQuote && !inBacktick) {
      inDoubleQuote = !inDoubleQuote;
      current += char;
      continue;
    }
    
    if (char === '`' && !inSingleQuote && !inDoubleQuote) {
      inBacktick = !inBacktick;
      current += char;
      continue;
    }
    
    // If we're in quotes, add everything
    if (inSingleQuote || inDoubleQuote || inBacktick) {
      current += char;
      continue;
    }
    
    // Handle delimiters (space, pipe, semicolon, ampersand)
    if (/[\s|;&]/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      // Also add the delimiter as a token (for chain detection)
      if (/[|;&]/.test(char)) {
        tokens.push(char);
      }
      continue;
    }
    
    current += char;
  }
  
  if (current) {
    tokens.push(current);
  }
  
  return tokens;
}

/**
 * Detect if command contains subshells $(…) or `…`
 */
function hasSubshell(commandString) {
  // Simple detection - look for $( or backticks
  // This won't catch all cases but handles common ones
  return /\$\(/.test(commandString) || /`[^`]+`/.test(commandString);
}

/**
 * Extract executables from within subshells $(...) and `...`
 */
function extractSubshellExecutables(commandString) {
  const executables = [];
  
  // Extract $(...) patterns
  const dollarSubshells = commandString.match(/\$\([^)]+\)/g) || [];
  dollarSubshells.forEach(subshell => {
    const inner = subshell.slice(2, -1); // Remove $( and )
    const innerExecs = extractExecutables(inner);
    executables.push(...innerExecs);
  });
  
  // Extract `...` patterns
  const backtickSubshells = commandString.match(/`[^`]+`/g) || [];
  backtickSubshells.forEach(subshell => {
    const inner = subshell.slice(1, -1); // Remove backticks
    const innerExecs = extractExecutables(inner);
    executables.push(...innerExecs);
  });
  
  return executables;
}

/**
 * Extract all potential executables from a command
 * Handles command chains, pipes, and subshells
 */
function extractExecutables(commandString) {
  const tokens = tokenizeCommand(commandString);
  const executables = [];
  let expectCommand = true;
  
  // First, extract executables from subshells
  const subshellExecs = extractSubshellExecutables(commandString);
  executables.push(...subshellExecs);
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Delimiters mean next token is a command
    if ([';', '|', '&', '&&', '||'].includes(token)) {
      expectCommand = true;
      continue;
    }
    
    // If we expect a command, this is an executable
    if (expectCommand && token && !token.startsWith('-')) {
      const execName = extractExecutableName(token);
      if (execName) {
        executables.push(execName);
      }
      expectCommand = false;
    }
  }
  
  return executables;
}

/**
 * Check if a command contains any of the specified executables
 * Handles quotes, paths, subshells, and command chaining
 * 
 * @param {string} commandString - The shell command to check
 * @param {string[]} executableNames - Array of executable names to search for
 * @returns {boolean} - true if any executable is found
 */
export function containsExecutable(commandString, executableNames) {
  if (!commandString || !executableNames || executableNames.length === 0) {
    return false;
  }
  
  // Normalize executable names to lowercase
  const normalizedNames = executableNames.map(name => name.toLowerCase());
  
  // Extract all executables from the command
  const foundExecutables = extractExecutables(commandString);
  
  // Check if any found executable matches
  return foundExecutables.some(exec => normalizedNames.includes(exec));
}

/**
 * Parse a command and extract detailed information
 * 
 * @param {string} commandString - The shell command to parse
 * @returns {Object} - { tokens, executables, hasSubshell, original }
 */
export function parseCommand(commandString) {
  return {
    tokens: tokenizeCommand(commandString),
    executables: extractExecutables(commandString),
    hasSubshell: hasSubshell(commandString),
    original: commandString
  };
}

/**
 * Extract the primary command and its arguments
 * Returns the first command in a chain
 * 
 * @param {string} commandString - The shell command
 * @returns {Object} - { executable, args }
 */
export function extractPrimaryCommand(commandString) {
  const tokens = tokenizeCommand(commandString);
  
  if (tokens.length === 0) {
    return { executable: '', args: [] };
  }
  
  const executable = extractExecutableName(tokens[0]);
  const args = tokens.slice(1).filter(t => ![';', '|', '&', '&&', '||'].includes(t));
  
  return { executable, args };
}
