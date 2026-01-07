/**
 * Network Blocker Plugin for OpenCode
 */
import { containsExecutable, parseCommand } from './lib/command-parser.js';
import { BLOCKED_NETWORK_TOOLS, hasScriptingNetworkAccess, isRemoteRsync, SHELL_TOOL_NAMES } from './lib/security-patterns.js';

export const NetworkBlocker = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, payload) => {
      
      // Check for all shell tool name variations
      const isShellTool = SHELL_TOOL_NAMES.includes(input.tool);
      
      // Get args from payload with null safety
      const args = payload?.args || {};
      const commandString = args.command || args.cmd || args.code || args.script;

      if (isShellTool && commandString) {
        const command = commandString.trim();
        const parsed = parseCommand(command);

        // Check for blocked network tools (handles quotes, paths, subshells)
        if (containsExecutable(command, BLOCKED_NETWORK_TOOLS)) {
          // Find which tool was detected
          const detectedTool = parsed.executables.find(exec => 
            BLOCKED_NETWORK_TOOLS.includes(exec)
          );
          throw new Error(
            `[SECURITY BLOCK]: Network command '${detectedTool}' is prohibited. Blocked: "${commandString}"`
          );
        }

        // Check for scripting language network access
        if (hasScriptingNetworkAccess(command)) {
          throw new Error(
            `[SECURITY BLOCK]: Scripting language network access is prohibited. Blocked: "${commandString}"`
          );
        }

        // Check for rsync with remote hosts
        if (isRemoteRsync(command, parsed.tokens)) {
          throw new Error(
            `[SECURITY BLOCK]: rsync with remote hosts is prohibited. Blocked: "${commandString}"`
          );
        }
      }
    },
    "tool.execute.after": async () => {},
  }
}
