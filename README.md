# opencode-config

OpenCode configuration with safety plugins, specialized agents, and workflow commands.

## Workflows

Here are the most common workflows:

- **Simple feature implementation**: `plan` agent → `use @code-monkey to write the plan to PLAN.md` → `/feature-implement` command
- **Complex feature implementation**: `/plan` command → `/feature-implement` command
- **Testing**: `/test-plan` command → `/test-implement` command → `/test-review` command
- **Code Quality**: `/review` command → `/refactor` command
- **Code Documentation**: `/document` command 

## Agents

All available agents:

- Opencodes **build** agent for standard coding
- Opencodes **plan** agent for standard planning tasks
- **Council** agent for complex tasks using a multi-model coordinator that consults 5 AI models (Claude Haiku/Sonnet/Opus, GPT-5.1, Gemini) to compare solutions and synthesize implementation specs based on the idea from [Andrej Karpathy](https://github.com/karpathy/llm-council)
- **Developer** agent for implementing a `PLAN.md` using AST-aware tools ([treesitter-mcp](https://github.com/Christoph/treesitter-mcp)) for code bases analysis and uses the build in `LSP` for better editing.
- **Tester** for planning and implementation of tests based on the [Khorikov's principles](https://www.manning.com/books/unit-testing) for sustainable test design
- **@code-monkey** subagent can be used with any other agent inside a prompt to use the fast and cheap Haiku mnodel for single file edits

## Commands

The commands use the custom agents and add context like tool and subagent usage.

- `/plan` - Creates architectural plans using AST tools to prepare the data and then uses council synthesis
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
