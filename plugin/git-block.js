export const GitBlocker = async ({ project, client, $, directory, worktree }) => {
  return {
    // FIX 1: Add 'payload' as the second argument
    "tool.execute.before": async (input, payload) => {
      
      // FIX 2: Check for standard shell tool names
      const isShellTool = ["bash", "terminal", "shell"].includes(input.tool);
      
      // FIX 3: Access arguments from 'payload' (with fallback)
      const args = payload?.args || input?.args || {};
      const commandString = args.command || args.cmd || args.code;

      if (isShellTool && commandString) {
        const command = commandString.trim();
        
        // Split command by spaces, pipes, and chain operators to find "git" anywhere
        const parts = command.split(/[\s|&;]+/);
        const gitIndex = parts.indexOf("git");

        if (gitIndex !== -1) {
          // Found 'git'. Now let's check what the NEXT word is (the subcommand)
          const subcommand = parts[gitIndex + 1];

          // Whitelist of allowed read-only commands
          const allowedSubcommands = ["status", "log", "diff", "show", "branch"];

          // If there is no subcommand (just "git") or it's not in the whitelist -> BLOCK
          if (!subcommand || !allowedSubcommands.includes(subcommand)) {
             throw new Error(
               `[SECURITY BLOCK]: Destructive git operations are prohibited. Allowed: ${allowedSubcommands.join(", ")}. Blocked: "${commandString}"`
             );
          }
        }
      }
    },
    "tool.execute.after": async () => {},
  }
}
