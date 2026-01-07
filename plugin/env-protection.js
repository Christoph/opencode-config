export const EnvProtection = async ({ project, client, $, directory, worktree }) => {
  
  // Comprehensive sensitive file patterns
  const sensitivePatterns = [
    /\.env(\.[a-z]+)?$/i,           // .env, .env.local, .env.production
    /credentials?\.json$/i,          // credentials.json, credential.json
    /secrets?\.json$/i,              // secrets.json
    /\.aws\/credentials$/i,          // AWS credentials
    /\.ssh\/(id_rsa|id_ed25519)$/i, // SSH private keys
    /\.npmrc$/,                      // NPM auth tokens
    /\.pypirc$/,                     // PyPI credentials
  ];
  
  function isSensitiveFile(filePath) {
    if (!filePath) return false;
    
    // Normalize path (replace backslashes for Windows)
    const normalized = filePath.replace(/\\/g, '/');
    
    return sensitivePatterns.some(pattern => pattern.test(normalized));
  }
  
  return {
    "tool.execute.before": async (input, payload) => {
      // Block read tool
      if (input.tool === "read" && payload?.args?.filePath) {
        if (isSensitiveFile(payload.args.filePath)) {
          throw new Error(`[SECURITY BLOCK]: Reading sensitive file is prohibited. Blocked: "${payload.args.filePath}"`);
        }
      }
      
      // Block write tool
      if (input.tool === "write" && payload?.args?.filePath) {
        if (isSensitiveFile(payload.args.filePath)) {
          throw new Error(`[SECURITY BLOCK]: Writing sensitive file is prohibited. Blocked: "${payload.args.filePath}"`);
        }
      }
      
      // Block shell commands that access sensitive files
      const isShellTool = ["bash", "terminal", "shell", "execute_command"].includes(input.tool);
      if (isShellTool && payload?.args?.command) {
        const command = payload.args.command;
        
        // Commands that access files
        const fileAccessCommands = ['cat', 'grep', 'head', 'tail', 'less', 'more', 'vim', 'vi', 'nano', 'emacs', 'source', 'tee'];
        
        for (const pattern of sensitivePatterns) {
          // Check if command contains file access command + sensitive file pattern
          for (const cmd of fileAccessCommands) {
            if (command.includes(cmd) && command.match(pattern)) {
              throw new Error(`[SECURITY BLOCK]: Shell command accessing sensitive file is prohibited. Blocked: "${command}"`);
            }
          }
        }
      }
    },
  }
}
