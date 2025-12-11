/**
 * Network Blocker Plugin for OpenCode
 */
export const NetworkBlocker = async ({ project, client, $, directory, worktree }) => {
  return {
    // FIX 1: Add the second argument 'payload'
    "tool.execute.before": async (input, payload) => {
      
      // FIX 2: Check for multiple tool names (some agents use 'terminal' or 'shell')
      const isShellTool = ["bash", "terminal", "shell", "execute_command"].includes(input.tool);
      
      // FIX 3: Get args from the correct place (payload)
      // We also check 'cmd' and 'code' because different agents name the argument differently
      const args = payload?.args || input?.args || {};
      const commandString = args.command || args.cmd || args.code || args.script;

      if (isShellTool && commandString) {
        const command = commandString.trim();

        // blocked tools list
        const blockedTools = [
          'curl', 'wget', 'nc', 'netcat', 'telnet', 
          'ftp', 'sftp', 'scp', 'ssh', 'socat'
        ];

        // FIX 4: Robust Token Check
        // Instead of a Regex that only looks at the start (^curl), 
        // we split the command by spaces, pipes (|), and chains (&&, ;)
        // This catches "curl localhost" AND "cd /tmp; curl localhost"
        const tokens = command.split(/[\s|&;]+/);

        for (const token of tokens) {
          const cleanToken = token.toLowerCase();
          
          if (blockedTools.includes(cleanToken)) {
            throw new Error(
              `[SECURITY BLOCK]: Network command '${cleanToken}' is prohibited. Blocked: "${commandString}"`
            );
          }
        }

        // Specific check for rsync to allow local copies but block remote
        if (tokens.includes('rsync')) {
           // rsync remote syntax usually involves ':' (user@host:path or host::module)
           if (command.includes(':')) {
              throw new Error(
                `[SECURITY BLOCK]: rsync with remote hosts is prohibited. Blocked: "${commandString}"`
              );
           }
        }
      }
    },
    "tool.execute.after": async () => {},
  }
}
