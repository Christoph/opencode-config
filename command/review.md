---
description: Comprehensive code review with quality, security, and performance analysis
agent: developer
model: anthropic/claude-opus-4-5
---

Review $ARGUMENTS for quality, security, maintainability, and performance.

## Process

### 1. Understand Structure
Use `code_map` and `treesitter-mcp` tools to understand the codebase structure:
- `code_map` for overall architecture
- `parse_file` for detailed implementation
- `file_shape` for API surface analysis

### 2. Analyze Context
Use `find_usages` to verify patterns and consistency across the codebase.

### 3. Evaluate Code
Focus on these areas in priority order:

#### Security (Critical)
- Injection risks (SQL, XSS, command injection)
- Insecure APIs or deprecated functions
- Unvalidated inputs
- Weak error handling that leaks information
- Authentication/authorization issues

#### Correctness (High)
- Edge cases and boundary conditions
- Race conditions
- Null/undefined handling
- Error handling completeness

#### Maintainability (High)
- Code clarity and readability
- Project style adherence
- Naming conventions
- Documentation quality

#### Performance (Medium)
- N+1 queries or redundant operations
- Memory allocation issues
- Inefficient algorithms or loops
- Unnecessary computations

#### Testing (Medium)
- Sufficient coverage for new logic
- Test quality and maintainability

### 4. Return Output
Return findings as structured markdown directly (do NOT write to REVIEW.md).

## Output Format

Return output in this structure:

```markdown
## Code Review: [Scope]

### Overall Assessment
[Brief objective assessment of quality, clarity, and standards adherence]

### 🔴 Critical Issues (Action Required)
- **file:line - Category**: [Issue description with explicit fix proposal]

### 🟡 Major Issues (Should Address)
- **file:line - Category**: [Issue description with recommended fix]

### 🟢 Minor Suggestions (Optional Improvements)
- **file:line - Category**: [Constructive improvement suggestion]

### ✅ Positive Aspects
[Brief recognition of good practices and clean solutions]

### Summary
- **Overall Health**: [Excellent/Good/Fair/Needs Work/Poor]
- **Critical Issues**: [count]
- **Major Issues**: [count]
- **Security Concerns**: [Yes/No - brief summary if yes]
- **Recommendation**: [Approve/Approve with changes/Needs revision]
```

## Review Principles

- Be objective and constructive
- Focus on behaviors and outcomes, not style preferences
- Provide explicit fix proposals, not just criticism
- Recognize good code as well as issues
- Consider project context and constraints

Review: $ARGUMENTS
