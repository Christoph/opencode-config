import { containsExecutable, extractPrimaryCommand } from './lib/command-parser.js';
import { isGitCommandAllowed, ALLOWED_GIT_SUBCOMMANDS, SHELL_TOOL_NAMES } from './lib/security-patterns.js';

export const GitBlocker = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, payload) => {
      
      // Check for all shell tool name variations
      const isShellTool = SHELL_TOOL_NAMES.includes(input.tool);
      
      // Access arguments from payload with null safety
      const args = payload?.args || {};
      const commandString = args.command || args.cmd || args.code;

      if (isShellTool && commandString) {
        const command = commandString.trim();
        
        // Use robust parser to detect git (handles quotes, paths, subshells)
        if (containsExecutable(command, ['git'])) {
          
          // Extract the primary git command and its arguments
          const { executable, args: cmdArgs } = extractPrimaryCommand(command);
          
          // If the primary command is git, validate it
          if (executable === 'git' && cmdArgs.length > 0) {
            const subcommand = cmdArgs[0].replace(/^["'`]+|["'`]+$/g, ''); // Remove quotes
            const subcommandArgs = cmdArgs.slice(1);
            
            // Check if subcommand and its flags are allowed
            if (!isGitCommandAllowed(subcommand, subcommandArgs)) {
              const allowedList = Object.keys(ALLOWED_GIT_SUBCOMMANDS).join(', ');
              throw new Error(
                `[SECURITY BLOCK]: Destructive git operations are prohibited. Allowed: ${allowedList}. Blocked: "${commandString}"`
              );
            }
          } else if (executable === 'git') {
            // Just "git" with no subcommand
            throw new Error(
              `[SECURITY BLOCK]: Git command requires a subcommand. Blocked: "${commandString}"`
            );
          } else {
            // Git appears in the command but not as primary executable
            // Could be in a subshell or pipe - block for safety
            throw new Error(
              `[SECURITY BLOCK]: Git command detected in complex shell expression. Blocked: "${commandString}"`
            );
          }
        }
      }
    },
    "tool.execute.after": async () => {},
  }
}
