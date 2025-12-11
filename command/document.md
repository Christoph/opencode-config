---
description: Generate or update documentation comments for functions, classes, and modules
agent: developer
model: anthropic/claude-sonnet-4-5
---

Add or update documentation for $ARGUMENTS.

## Process

### 1. Find Files
Use `glob` to locate relevant files matching the scope:
- If $ARGUMENTS is a specific file → document that file
- If $ARGUMENTS is a pattern (*.js) → find matching files
- If $ARGUMENTS is a directory → find code files in directory

### 2. Read Code
Use `read` to examine each file's implementation.

### 3. Generate Documentation
Add language-appropriate doc comments:
- **JavaScript/TypeScript**: JSDoc (`/** ... */`)
- **Python**: Google or NumPy style docstrings
- **Rust**: Rustdoc (`/// ...`)
- **Go**: godoc comments
- **Java/Kotlin**: Javadoc
- **C/C++**: Doxygen

### 4. Save Changes
Use `edit` to update files with documentation.

## Documentation Standards

### For Functions
Document:
- Purpose (what it does and why it exists)
- Parameters (type, description, constraints)
- Return value (type, description)
- Exceptions/errors that can be thrown
- Side effects (if any)
- Examples (for complex functions)

### For Classes
Document:
- Responsibility (what this class is for)
- Key methods and properties
- Usage examples
- Relationships to other classes (if important)

### For Modules
Document:
- Module purpose
- Main exports
- Usage examples
- Dependencies (if non-obvious)

## Rules

**DO**:
- Explain the purpose and "why", not just the "what"
- Keep documentation concise and precise
- Use clear, simple language
- Document public APIs (functions, classes, modules)
- Include parameter types and return types
- Mention side effects and exceptions

**DON'T**:
- Simply repeat the function name
- Over-document trivial code (simple getters/setters)
- Add documentation as a crutch for bad code (suggest refactoring instead)
- Use jargon without explanation
- Write essays (keep it concise)

## Output Format

Provide summary of:
1. Files processed
2. Functions/classes documented
3. Any code that should be refactored instead of documented

Document: $ARGUMENTS
