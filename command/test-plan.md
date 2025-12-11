---
description: Create a test plan for a file or feature
agent: tester
model: anthropic/claude-sonnet-4-5
---
Analyze $ARGUMENTS and create a comprehensive test plan.

## Steps
1. Read the target file(s) thoroughly
2. Identify all public behaviors (not internal methods)
3. Classify the code type (Domain/Controller/Infrastructure)
4. Determine test doubles strategy
5. Output the test plan

## Output Format
```markdown
## Test Plan: [Component Name]

### Classification
- **Type**: Domain Logic / Controller / Infrastructure
- **Approach**: Unit Tests / Integration Tests / Both
- **Rationale**: Why this approach fits

### Dependencies Analysis
| Dependency | Direction | Double Type | Rationale |
|------------|-----------|-------------|-----------|
| [Name] | Incoming/Outgoing | Stub/Mock/Real | [Why] |

### Behaviors to Test
List each behavior as a user-facing outcome:
- [ ] **Behavior 1**: When [condition], then [expected outcome]
- [ ] **Behavior 2**: When [condition], then [expected outcome]

### Test Cases

#### [Behavior 1 Name]
- **Style**: Output-based / State-based / Communication-based
- **Arrange**: [Setup needed]
- **Act**: [Action to perform]
- **Assert**: [What to verify]
- **Edge cases**: [Boundary conditions]

### Edge Cases & Error Scenarios
- [ ] Invalid input: [description]
- [ ] Boundary condition: [description]
- [ ] Error state: [description]

### Notes
Any additional considerations, warnings about complexity, or suggestions.
```

## Rules
- Focus on BEHAVIORS, not methods
- Prefer output-based testing where possible
- Only mock outgoing side effects (emails, external APIs, message queues)
- Use stubs for incoming data (repositories reading, config)
- Never suggest testing trivial code (getters/setters/simple mappings)
- Consider the test pyramid: more unit tests, fewer integration tests
