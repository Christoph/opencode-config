---
description: Implement tests from a test plan or description
model: anthropic/claude-sonnet-4-5
---
Implement tests for $ARGUMENTS following Khorikov's principles.

## Steps
1. Read the test plan or source file
2. Identify the testing framework in use (detect from existing tests or package.json/requirements.txt/go.mod)
3. Create test file with proper naming convention
4. Implement each test case following AAA pattern
5. Run tests to verify they pass

## Test Structure (AAA Pattern)
```
def test_[behavior]_[expected_result]():
    # Arrange - set up preconditions
    
    # Act - perform the action (single line ideally)
    
    # Assert - verify outcomes
```

## Naming Convention
Name tests by behavior, not by method:
- ✅ `test_order_applies_discount_for_premium_customers`
- ✅ `test_empty_cart_returns_zero_total`
- ✅ `test_payment_fails_when_insufficient_funds`
- ❌ `test_calculate`
- ❌ `test_process_order`

## Rules
1. **One behavior per test** - but multiple assertions for same behavior are OK
2. **No logic in tests** - no if/else/loops in test code
3. **Descriptive variable names** - `premium_customer` not `c1`
4. **Minimal setup** - only what's needed for this specific test
5. **Independent tests** - no shared mutable state between tests
6. **Test public API** - don't test private methods directly

## Test Doubles Guidelines
```python
# STUB - incoming dependency, provide data, never verify
def test_order_total():
    inventory_stub = FakeInventory(items={"SKU1": 10})  # just provides data
    order = Order(inventory_stub)
    assert order.total == expected

# MOCK - outgoing dependency, verify interaction
def test_order_sends_confirmation():
    email_mock = Mock()
    order = Order(email_service=email_mock)
    order.place()
    email_mock.send.assert_called_once()  # verify side effect
```

## Framework Detection
- Python: Look for pytest/unittest in requirements.txt or existing tests
- JavaScript/TypeScript: Check package.json for jest/vitest/mocha
- Go: Use standard testing package
- Rust: Use standard #[test] or look for test dependencies

## Output
1. Create test file at appropriate location (e.g., `tests/test_[module].py`, `__tests__/[module].test.ts`)
2. Implement all test cases
3. Run tests with appropriate command
4. Report results
