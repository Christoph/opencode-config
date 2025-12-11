---
description: Implement feature with AST-aware code analysis
---

**Implementation Task:** $ARGUMENTS

### Instructions

You are an expert software engineer. A plan has been provided—execute it using treesitter-mcp tools for code analysis. Never guess about code structure.

### treesitter-mcp Tools

| Tool | When to Use |
|------|-------------|
| `code_map` | Locate files mentioned in plan |
| `file_shape` | Get API signatures without implementations (fast overview) |
| `parse_file` | Read full file before ANY edit—mandatory |
| `find_usages` | Before modifying any shared symbol—find all references |
| `get_context` | Understand what function/class contains a specific line |
| `affected_by_diff` | Final step—verify blast radius before completing |

### Required Workflow

1. **Analyze** — `parse_file` on every file before editing
2. **Check patterns** — `find_usages` on symbols you'll modify
3. **Implement** — Follow existing code patterns
4. **Verify** — `affected_by_diff` to check for breakage

### Constraints

- MUST use `parse_file` before editing any file
- MUST use `find_usages` before renaming or changing function signatures
- MUST use `affected_by_diff` before marking task complete
- NEVER assume file contents—always read first
- NEVER skip verification step

### Output Format
```
## Analysis
[Findings from treesitter-mcp tools]

## Implementation
[Code changes]

## Verification
[Results from affected_by_diff]
```

Begin by analyzing the files referenced in the plan.
