export const RmProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    // CHANGE 1: Add the second argument 'payload' (or 'args')
    "tool.execute.before": async (input, payload) => {
      
      // CHANGE 2: Access args from 'payload', not 'input'
      if (input.tool === "bash" && payload.args?.command) {
        const command = payload.args.command.trim();
        
        // Block recursive rm (-r, -rf, -fr, etc.)
        if (command.match(/rm\s+(-[^-]*r|-rf|-fr|-R)/i)) {
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
        if (command.startsWith("rm ")) {
          const args = command.slice(3).trim();
          
          const parts = args.split(/\s+/);
          const files = parts.filter(p => !p.startsWith('-'));
          
          if (files.length > 1) {
            throw new Error(
              `[SECURITY BLOCK]: rm multiple files is prohibited. Remove one file at a time. Blocked: "${command}"`
            );
          }
        }
      }
    },
    "tool.execute.after": async () => {},
  }
}
