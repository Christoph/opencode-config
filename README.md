# opencode-config

OpenCode configuration with safety plugins, specialized agents, and workflow commands.

## Agents

Custom agents for specialized workflows:

- **council** - Multi-model coordinator that consults 5 AI models (Claude Haiku/Sonnet/Opus, GPT-5.1, Gemini) to compare solutions and synthesize implementation specs based on the idea from [Andrej Karpathy](https://github.com/karpathy/llm-council)
- **developer** - Expert coding assistant with AST-aware tools ([treesitter-mcp](https://github.com/Christoph/treesitter-mcp)) for reading, editing, and executing code changes
- **tester** - Testing specialist following Khorikov's principles for sustainable test design

## Commands

Workflow commands for common development tasks:

- `/plan` - Creates architectural plans using council synthesis with all 5 models
- `/review` - Comprehensive code review analyzing quality, security, and performance
- `/refactor` - Safe refactoring with structural analysis and impact verification
- `/document` - Generates or updates documentation comments for code
- `/test-plan` - Creates test plans identifying behaviors and test strategies
- `/feature-implement` - Implements features with AST-aware code analysis
- `/test-implement` - Implements tests following testing best practices
- `/test-review` - Reviews existing tests for quality and maintainability

## Plugins

Safety plugins that prevent destructive operations:

- **env-protection** - Blocks reading .env files to prevent credential exposure
- **git-block** - Restricts git to read-only operations (status, log, diff, show, branch)
- **network-blocker** - Prevents network commands (curl, wget, ssh, etc.)
- **rm-protection** - Blocks recursive deletion, wildcards, and multi-file rm commands
