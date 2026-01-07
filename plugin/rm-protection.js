import { containsExecutable } from './lib/command-parser.js';
import { hasIndirectDeletion, SHELL_TOOL_NAMES } from './lib/security-patterns.js';

export const RmProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, payload) => {
      
      // Check for all shell tool name variations
      const isShellTool = SHELL_TOOL_NAMES.includes(input.tool);
      
      if (isShellTool && payload?.args?.command) {
        const command = payload.args.command.trim();
        
        // Block indirect deletion commands (find -delete, xargs rm, etc.)
        if (hasIndirectDeletion(command)) {
          throw new Error(
            `[SECURITY BLOCK]: Indirect file deletion commands are prohibited. Blocked: "${command}"`
          );
        }
        
        // Check if command contains rm (handles quotes, paths, etc.)
        if (containsExecutable(command, ['rm'])) {
          
          // Block recursive rm (short and long flags)
          if (command.match(/rm\s+((-[^-]*r)|(-rf)|(-fr)|(-R)|--recursive|--no-preserve-root)/i)) {
            throw new Error(
              `[SECURITY BLOCK]: Recursive rm is prohibited. Use single file deletion only. Blocked: "${command}"`
            );
          }
          
          // Block wildcards that could match multiple files
          if (command.match(/rm\s+[^|]*[\*\?\[\]]/)) {
            throw new Error(
              `[SECURITY BLOCK]: rm with wildcards is prohibited. Specify exact filename. Blocked: "${command}"`
            );
          }
          
          // Block multiple file deletion
          // Extract rm command portion (before pipes/chains)
          const rmPortion = command.split(/[|;&]/)[0];
          if (rmPortion.includes('rm')) {
            // Simple heuristic: count arguments that look like files (not flags)
            const parts = rmPortion.split(/\s+/);
            const rmIndex = parts.findIndex(p => p.includes('rm'));
            if (rmIndex !== -1) {
              const argsAfterRm = parts.slice(rmIndex + 1);
              const files = argsAfterRm.filter(p => !p.startsWith('-') && p.length > 0);
              
              if (files.length > 1) {
                throw new Error(
                  `[SECURITY BLOCK]: rm multiple files is prohibited. Remove one file at a time. Blocked: "${command}"`
                );
              }
            }
          }
        }
      }
    },
    "tool.execute.after": async () => {},
  }
}
