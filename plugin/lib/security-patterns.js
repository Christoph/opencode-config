/**
 * Centralized security patterns and policies for all security plugins
 * Single source of truth for blocked/allowed commands
 */

// Network tools that should be blocked
export const BLOCKED_NETWORK_TOOLS = [
  'curl', 'wget', 'nc', 'netcat', 'ncat', 'telnet',
  'ftp', 'sftp', 'scp', 'ssh', 'socat',
  'httpie', 'http', 'aria2c', 'lynx', 'w3m', 'links', 'elinks'
];

// Git subcommands that are allowed (read-only operations)
export const ALLOWED_GIT_SUBCOMMANDS = {
  'status': [],
  'log': ['-n', '--oneline', '--graph', '--decorate', '--all', '--stat', '--pretty', '--format'],
  'diff': ['--cached', '--staged', '--name-only', '--stat', '--name-status'],
  'show': ['--stat', '--name-only', '--pretty', '--format'],
  'branch': ['-a', '-r', '-v', '--list', '-l', '--all', '--remote']
};

// Sensitive file patterns that should be protected
export const SENSITIVE_FILE_PATTERNS = [
  /\.env(\.[a-z]+)?$/i,           // .env, .env.local, .env.production
  /credentials?\.json$/i,          // credentials.json, credential.json
  /secrets?\.json$/i,              // secrets.json
  /\.aws\/credentials$/i,          // AWS credentials
  /\.ssh\/(id_rsa|id_ed25519|id_dsa|config)$/i, // SSH private keys
  /\.npmrc$/,                      // NPM auth tokens
  /\.pypirc$/,                     // PyPI credentials
  /\.netrc$/,                      // Network credentials
  /\.pgpass$/,                     // PostgreSQL password file
];

// File access commands that can read/write sensitive files
export const FILE_ACCESS_COMMANDS = [
  'cat', 'grep', 'head', 'tail', 'less', 'more', 
  'vim', 'vi', 'nano', 'emacs', 'source', 'tee',
  'sed', 'awk', 'cut', 'sort', 'uniq'
];

// Indirect deletion commands that should be blocked
export const INDIRECT_DELETION_PATTERNS = [
  /find.*-(delete|exec\s+rm)/i,     // find with delete or exec rm
  /xargs\s+rm/i,                     // xargs rm
  /(perl|python|ruby).*unlink/i,    // Scripting language unlink
];

// Tool name variations for shell commands
export const SHELL_TOOL_NAMES = ['bash', 'terminal', 'shell', 'execute_command'];

/**
 * Check if a file path matches sensitive file patterns
 */
export function isSensitivePath(filePath) {
  if (!filePath) return false;
  
  // Normalize path
  const normalized = filePath.replace(/\\/g, '/');
  
  return SENSITIVE_FILE_PATTERNS.some(pattern => pattern.test(normalized));
}

/**
 * Validate if a git subcommand and its arguments are allowed
 */
export function isGitCommandAllowed(subcommand, args) {
  if (!subcommand) return false;
  
  const allowedFlags = ALLOWED_GIT_SUBCOMMANDS[subcommand.toLowerCase()];
  
  // If subcommand not in whitelist, block it
  if (!allowedFlags) return false;
  
  // If no args required and no args provided, allow
  if (allowedFlags.length === 0 && args.length === 0) {
    return true;
  }
  
  // If no args provided but some are allowed, that's ok (args are optional)
  if (args.length === 0) {
    return true;
  }
  
  // Check if all args start with an allowed flag
  // This is permissive - allows any value after the flag
  return args.every(arg => {
    // Skip non-flag arguments (like file paths)
    if (!arg.startsWith('-')) return true;
    
    // Check if flag is in allowed list
    return allowedFlags.some(allowedFlag => 
      arg === allowedFlag || arg.startsWith(allowedFlag + '=')
    );
  });
}

/**
 * Check if command contains indirect deletion patterns
 */
export function hasIndirectDeletion(command) {
  return INDIRECT_DELETION_PATTERNS.some(pattern => pattern.test(command));
}

/**
 * Detect scripting language network access patterns
 */
export function hasScriptingNetworkAccess(command) {
  const patterns = [
    /python.*-m\s+(http\.server|SimpleHTTPServer)/i,
    /node.*(-e|--eval).*(fetch|http|https|request)/i,
    /ruby.*-r\s*net\/(http|ftp)/i,
    /perl.*LWP::/i,
    /php.*-r.*curl_/i,
  ];
  
  return patterns.some(pattern => pattern.test(command));
}

/**
 * Detect rsync with remote hosts
 */
export function isRemoteRsync(command, tokens) {
  if (!tokens.some(t => t.toLowerCase().includes('rsync'))) {
    return false;
  }
  
  // Check for remote syntax
  return (
    command.match(/rsync.*(-e|--rsh)/) || 
    command.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+:/) || // user@host:path syntax
    command.match(/[a-zA-Z0-9._-]+::/) || // host::module syntax
    command.match(/rsync:\/\//) // rsync:// protocol
  );
}

/**
 * Check if a command accesses sensitive files
 */
export function accessesSensitiveFile(command) {
  for (const pattern of SENSITIVE_FILE_PATTERNS) {
    for (const cmd of FILE_ACCESS_COMMANDS) {
      // Simple heuristic: command contains both a file access command and sensitive pattern
      if (command.includes(cmd) && command.match(pattern)) {
        return true;
      }
    }
  }
  return false;
}
