# Red/Green/Blue TDD Pattern

## Overview

The Red/Green/Blue TDD pattern is a disciplined approach to feature development that ensures code quality through a three-phase cycle: write failing tests (RED), implement minimal working code (GREEN), and refactor for quality (BLUE).

## The Three Phases

### 🔴 RED Phase - Write Failing Tests

**Goal**: Specify the desired behavior through tests that fail

**Activities**:
1. Write tests that describe what the code should do
2. Run tests to verify they fail for the right reason
3. Confirm the failure is due to missing functionality (not test errors)

**Success Criteria**:
- Tests compile/parse correctly
- Tests fail because functionality doesn't exist yet
- Failure messages clearly indicate what's missing

**Agent Assignment**: `tester` agent writes the failing tests

**Orchestrator Role**: Run tests to confirm RED state

**Common Mistakes to Avoid**:
- Writing tests that pass immediately (no value)
- Tests that fail for wrong reasons (syntax errors, wrong imports)
- Testing implementation details instead of behaviors
- Writing too many tests at once (keep iterations small)

---

### 🟢 GREEN Phase - Make Tests Pass

**Goal**: Implement the simplest code that makes tests pass

**Activities**:
1. Write minimal code to satisfy test requirements
2. Run tests to verify they now pass
3. Resist the urge to refactor or optimize

**Success Criteria**:
- All tests pass
- Code works correctly for specified behaviors
- No focus on code quality yet (that's BLUE phase)

**Agent Assignment**: 
- `code-monkey` for simple, straightforward implementations
- `general` for complex, multi-file implementations

**Orchestrator Role**: Run tests to confirm GREEN state

**Common Mistakes to Avoid**:
- Premature optimization (wait for BLUE phase)
- Adding extra features not covered by tests
- Refactoring while trying to get to green
- Skipping tests to "save time"

---

### 🔵 BLUE Phase - Refactor & Review

**Goal**: Improve code quality while keeping tests green

**Activities**:
1. Identify code smells and improvement opportunities
2. Apply refactorings (rename, extract, simplify)
3. Run tests after each refactoring
4. Review for security, performance, maintainability

**Success Criteria**:
- Code is clean, readable, and maintainable
- Tests still pass after all refactorings
- No duplication or code smells
- Follows project conventions and best practices

**Agent Assignment**:
- `reviewer` identifies improvements and code smells
- `code-monkey` or `general` applies refactorings
- `reviewer` performs final quality check (optional)

**Orchestrator Role**: Run tests after each refactoring to maintain GREEN state

**Common Mistakes to Avoid**:
- Changing behavior during refactoring (tests should remain green)
- Refactoring without running tests between changes
- Over-engineering the solution
- Skipping BLUE phase due to time pressure

---

## Complete TDD Workflows

### Simple Feature Implementation

```
1. [Orchestrator] Create todos for RED/GREEN/BLUE phases
2. [Orchestrator] Delegate to tester: "Write tests for [feature]"
3. [Tester] Write failing tests
4. [Orchestrator] Run tests → Confirm RED ❌
5. [Orchestrator] Delegate to code-monkey: "Implement [feature] to pass tests"
6. [Code-Monkey] Write minimal implementation
7. [Orchestrator] Run tests → Confirm GREEN ✅
8. [Orchestrator] Delegate to reviewer: "Review code for improvements"
9. [Reviewer] Identify refactoring opportunities
10. [Orchestrator] Delegate to code-monkey: "Apply refactorings: [list]"
11. [Code-Monkey] Refactor code
12. [Orchestrator] Run tests → Confirm still GREEN ✅
```

### Complex Feature Implementation

```
1. [Orchestrator] Create todos for design + RED/GREEN/BLUE phases
2. [Orchestrator] Delegate to architect: "Design approach for [feature]"
3. [Architect] Design solution and test strategy
4. [Orchestrator] Delegate to tester: "Write comprehensive tests for [feature]"
5. [Tester] Write full test suite
6. [Orchestrator] Run tests → Confirm RED ❌
7. [Orchestrator] Delegate to general: "Implement [feature] according to design"
8. [General] Implement solution
9. [Orchestrator] Run tests → If not green, iterate steps 8-9
10. [Orchestrator] Confirm GREEN ✅
11. [Orchestrator] Delegate to reviewer: "Review for refactoring opportunities"
12. [Reviewer] Identify improvements
13. [Orchestrator] Delegate to general: "Refactor: [improvements]"
14. [General] Apply refactorings
15. [Orchestrator] Run tests → Confirm still GREEN ✅
16. [Orchestrator] Delegate to reviewer: "Final quality and security review"
17. [Reviewer] Final review
```

### Bug Fix with TDD

```
1. [Orchestrator] Create todos for RED/GREEN/BLUE phases
2. [Orchestrator] Delegate to tester: "Write test that reproduces bug: [description]"
3. [Tester] Write failing test demonstrating the bug
4. [Orchestrator] Run test → Confirm RED ❌ (bug confirmed)
5. [Orchestrator] Delegate to code-monkey: "Fix bug to make test pass"
6. [Code-Monkey] Fix the bug
7. [Orchestrator] Run tests → Confirm GREEN ✅
8. [Orchestrator] Delegate to reviewer: "Check if fix introduces issues"
9. [Reviewer] Review the fix
10. [Orchestrator] Apply any necessary adjustments
11. [Orchestrator] Run tests → Confirm still GREEN ✅
```

---

## Key Principles

### 1. Always Verify State Transitions
- RED → GREEN: Orchestrator must run tests to confirm transition
- GREEN → GREEN: Tests must stay green through refactoring
- If tests don't fail in RED phase, stop and fix the tests

### 2. Small, Fast Iterations
- Keep each RED/GREEN/BLUE cycle focused on one small behavior
- Don't write all tests at once
- Don't implement everything in one GREEN phase
- Multiple small cycles > one large cycle

### 3. Tests as Specifications
- Tests document what the code should do
- Write tests from user's perspective (behavior, not implementation)
- Test names should read like requirements

### 4. Refactor Fearlessly in BLUE
- Green tests provide safety net
- Run tests after each small refactoring
- If tests break, you've changed behavior (revert)
- If tests stay green, refactoring is safe

### 5. Orchestrator Controls Test Execution
- Never delegate test running to other agents
- Orchestrator runs tests to verify each phase
- This ensures proper workflow and state tracking

---

## Test Quality Guidelines

### Good Tests (Write These)
- Test behaviors, not methods
- One behavior per test
- Clear Arrange-Act-Assert structure
- Descriptive names: `test_order_applies_discount_for_premium_customers`
- Independent (no shared state)
- Fast execution
- Deterministic (no randomness or flakiness)

### Bad Tests (Avoid These)
- Testing private methods directly
- Testing implementation details
- Logic in tests (if/else/loops)
- Shared mutable state between tests
- Dependence on external services (use test doubles)
- Vague names: `test_calculate`, `test_process`

---

## Test Doubles Strategy

### Stubs (Incoming Dependencies)
- Provide data to system under test
- Never verify interactions
- Use for: repositories, config, queries

```python
# STUB example
inventory_stub = FakeInventory(items={"SKU1": 10})
order = Order(inventory_stub)
assert order.total == 50.00
```

### Mocks (Outgoing Dependencies)
- Verify side effects
- Only for outgoing commands
- Use for: email services, message queues, external APIs

```python
# MOCK example
email_mock = Mock()
order = Order(email_service=email_mock)
order.place()
email_mock.send.assert_called_once_with(to="user@example.com")
```

---

## When to Use TDD

### ✅ Use TDD For:
- New features with clear requirements
- Bug fixes (write test that reproduces bug first)
- Complex business logic
- Code that will change frequently
- Critical functionality

### ⚠️ Consider Alternatives For:
- Exploratory coding (spike solutions)
- UI styling and layout
- Throwaway prototypes
- Code you'll delete soon

### 🚫 Skip TDD For:
- Simple data structures (POJOs, DTOs)
- Trivial getters/setters
- Generated code
- Configuration files

---

## Common TDD Mistakes

1. **Writing tests after code** - This is not TDD
2. **Skipping RED phase** - Must verify tests fail first
3. **Multiple behaviors per test** - Keep tests focused
4. **Testing implementation details** - Test behaviors instead
5. **Skipping BLUE phase** - Refactoring is essential
6. **Large test batches** - Write one test at a time
7. **Changing behavior during BLUE** - Refactor without changing behavior
8. **Not running tests frequently** - Run after every small change

---

## Benefits of Red/Green/Blue TDD

### Development Benefits
- **Clear requirements**: Tests specify what code should do
- **Fast feedback**: Know immediately when something breaks
- **Design improvement**: Writing tests first improves API design
- **Regression prevention**: Tests catch future breaking changes

### Code Quality Benefits
- **High coverage**: Tests written first ensure coverage
- **Minimal code**: GREEN phase avoids over-engineering
- **Clean design**: BLUE phase ensures maintainability
- **Living documentation**: Tests document expected behavior

### Team Benefits
- **Confidence**: Refactor fearlessly with green tests
- **Onboarding**: Tests show how code is meant to work
- **Collaboration**: Tests define done state
- **Debugging**: Test failures pinpoint problems

---

## Integration with Orchestrator

The orchestrator coordinates the TDD workflow:

1. **Planning**: Creates todos for each phase (RED/GREEN/BLUE)
2. **Delegation**: Assigns work to appropriate agents
3. **Verification**: Runs tests to confirm state transitions
4. **Coordination**: Ensures proper phase sequencing
5. **Quality**: Ensures BLUE phase isn't skipped

This keeps the workflow disciplined and ensures all phases are completed properly.
