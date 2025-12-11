---
description: Safe code refactoring with structural analysis and impact verification
agent: developer
model: anthropic/claude-sonnet-4-5
---

Refactor $ARGUMENTS using treesitter-mcp for safe structural changes.

## Mandatory Workflow

You MUST follow this workflow. Each step is required:

### 1. Analyze Structure
Use `code_map` to understand the overall structure and locate relevant code.

### 2. Parse Target Files
Use `parse_file` on EVERY file you plan to modify. This is mandatory before any edits.

### 3. Find All Usages
Use `find_usages` on any symbol you're renaming or changing:
- Functions being renamed
- Function signatures being changed
- Classes being moved or renamed
- Variables being refactored

### 4. Implement Changes
Make the refactoring changes using `edit` tool:
- Preserve all existing behavior
- No feature changes during refactoring
- Update all usages found in step 3

### 5. Verify Impact
Use `affected_by_diff` to verify the blast radius of your changes.

### 6. Test
Run relevant tests to ensure behavior is preserved.

## Safety Rules

**MUST**:
- Use `parse_file` before editing ANY file
- Use `find_usages` before renaming or changing signatures
- Use `affected_by_diff` before completing
- Preserve existing behavior (no feature changes)
- Run tests after refactoring

**MUST NOT**:
- Edit files without first using `parse_file`
- Rename symbols without using `find_usages`
- Complete refactoring without using `affected_by_diff`
- Add new features (refactoring = structure only)
- Skip tests

## Output Format

Provide clear output showing:
1. What was analyzed (code_map, parse_file results)
2. What usages were found (find_usages results)
3. What changes were made (edited files with line numbers)
4. What impact was detected (affected_by_diff results)
5. Test results

Execute refactoring for: $ARGUMENTS
