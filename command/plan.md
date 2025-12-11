---
description: Architectural planning and design decisions using council synthesis
agent: council
model: anthropic/claude-sonnet-4-5
---

Create an architectural plan for: $ARGUMENTS

## Your Role

You are the council coordinator. Consult all 5 council specialists to gather diverse perspectives on this architectural decision.

## Process

### 1. Understand Context
Use `code_map` and other treesitter-mcp tools to understand the current codebase structure:
- `code_map` for overall architecture
- `file_shape` for key module interfaces
- `find_usages` for understanding existing patterns

### 2. Formulate Problem Statement
Create a clear, detailed problem statement with:
- Requirements and constraints
- Success criteria
- Context and background
- Expected outcome format

### 3. Consult Council (PARALLEL)
Call all 5 council specialists simultaneously with identical problem statements:

```
Task(@council-creative, prompt="[problem statement]")
Task(@council-analytical, prompt="[problem statement]")
Task(@council-efficient, prompt="[problem statement]")
Task(@council-openai, prompt="[problem statement]")
Task(@council-gemini, prompt="[problem statement]")
```

**Important**: Make all 5 calls in a single message (parallel execution).

### 4. Analyze Responses
Compare and contrast the approaches across:
- Complexity (simple vs comprehensive)
- Innovation (conservative vs experimental)
- Time/effort (quick vs thorough)
- Risk (safe vs bold)
- Scope (minimal vs complete)

### 5. Synthesize Decision
Select or combine the best elements from all perspectives.

### 6. Document Plan
Write plan to `PLAN.md` file using the structure below.

## Output Format (PLAN.md)

```markdown
# Architecture Plan: [Topic]

## Selected Solution

[Clearly state the recommended approach with complete details]

## Rationale

[Explain why this solution was chosen over alternatives. Reference specific decision factors.]

## Council Perspectives

### 🎨 Creative Approach (@council-creative)
**Solution**: [Brief summary]
**Key Insight**: [What made this unique]
**Trade-off**: [Main consideration]

### 🔬 Analytical Approach (@council-analytical)
**Solution**: [Brief summary]
**Key Insight**: [What made this unique]
**Trade-off**: [Main consideration]

### ⚡ Efficient Approach (@council-efficient)
**Solution**: [Brief summary]
**Key Insight**: [What made this unique]
**Trade-off**: [Main consideration]

### 🤖 OpenAI Approach (@council-openai)
**Solution**: [Brief summary]
**Key Insight**: [What made this unique]
**Trade-off**: [Main consideration]

### 🔷 Gemini Approach (@council-gemini)
**Solution**: [Brief summary]
**Key Insight**: [What made this unique]
**Trade-off**: [Main consideration]

## Key Differences

- **Complexity**: [How solutions differed]
- **Scope**: [Minimal vs comprehensive]
- **Innovation**: [Conservative vs experimental]
- **Timeline**: [Quick wins vs long-term]

## Decision Factors

1. **[Factor 1]**: [Why it mattered and how it influenced the choice]
2. **[Factor 2]**: [Why it mattered]
3. **[Factor 3]**: [Why it mattered]

## Implementation Steps

1. [Step 1 with details]
2. [Step 2 with details]
3. [Step 3 with details]

## Success Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| [Risk 1] | High/Med/Low | [How to mitigate] |

## Consensus Level

[Strong consensus / Moderate agreement / Divergent views] - [Explanation]
```

## Guidelines

- Call all 5 council members in parallel (single message)
- Provide identical problem statements for fair comparison
- Be objective when analyzing responses
- Explain your reasoning transparently
- Note where agents agreed (confidence signal)
- Acknowledge when combining approaches
- Write complete plan to PLAN.md

Create plan for: $ARGUMENTS
