---
description: Review tests against the four pillars
model: anthropic/claude-sonnet-4-5
---
Review $ARGUMENTS against Khorikov's four pillars and identify improvements.

## Steps
1. Read the test file(s)
2. Read the source code being tested
3. Evaluate each test against the four pillars
4. Identify anti-patterns
5. Provide actionable recommendations

## Four Pillars Evaluation

### 1. Protection Against Regressions
- Does the test exercise meaningful code paths?
- Would a bug in the production code cause this test to fail?
- Is it testing trivial code that doesn't need tests?

### 2. Resistance to Refactoring (MOST IMPORTANT)
- Does the test verify behavior or implementation?
- Would renaming a private method break this test?
- Is it testing HOW something works vs WHAT it produces?
- Are mocks verifying internal method calls?

### 3. Fast Feedback
- Does the test have unnecessary external dependencies?
- Could this be a unit test instead of integration test?
- Are there slow operations that could be stubbed?

### 4. Maintainability
- Is the test easy to understand at a glance?
- Is the test name descriptive of the behavior?
- Is there excessive setup/boilerplate?
- Does it follow AAA pattern clearly?

## Anti-Patterns Checklist
- [ ] **Implementation coupling**: Verifying internal method calls
- [ ] **Over-mocking**: Mocking domain collaborators instead of using real ones
- [ ] **Stub verification**: Asserting that stubs were called (stubs should never be verified)
- [ ] **Brittle selectors**: Tests that break on unrelated changes
- [ ] **Shared state**: Tests depend on other tests' side effects
- [ ] **Logic in tests**: if/else/loops in test code
- [ ] **Testing trivial code**: Getters, setters, simple mappings
- [ ] **God tests**: Single test verifying too many unrelated behaviors
- [ ] **Missing edge cases**: Only happy path tested

## Output Format
```markdown
## Test Review: [File Name]

### Summary
- Tests reviewed: X
- Issues found: Y
- Overall health: Good / Needs Improvement / Poor

### Four Pillars Score
| Pillar | Score | Notes |
|--------|-------|-------|
| Regression Protection | ⭐⭐⭐ | |
| Refactoring Resistance | ⭐⭐ | |
| Fast Feedback | ⭐⭐⭐ | |
| Maintainability | ⭐⭐ | |

### Issues Found

#### 🔴 Critical (breaks on refactoring)
- [test name]: [issue description]

#### 🟡 Warning (suboptimal but functional)
- [test name]: [issue description]

#### 🟢 Suggestions (minor improvements)
- [test name]: [suggestion]

### Recommendations
1. [Specific actionable recommendation]
2. [Specific actionable recommendation]

### Example Fix
Before:
```[lang]
[problematic code]
```

After:
```[lang]
[improved code]
```
```
