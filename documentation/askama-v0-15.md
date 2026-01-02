# Askama Template Syntax Reference (v0.15+)

Compile-time, type-safe Jinja-like templates for Rust.

## Delimiters

| Type | Syntax | Notes |
|------|--------|-------|
| Expression | `{{ expr }}` | Outputs value |
| Tag | `{% tag %}` | Control flow |
| Comment | `{# comment #}` | Nestable |

**Whitespace control:** `-` strips, `+` preserves  
`{{- expr -}}` `{%- tag -%}` `{%+ tag %}`

## Variables

```html
{% let x = "value" %}
{% let mut y = 0 %}
{% set z = "jinja-compat" %}
{% decl val %}              {# declare without value #}
{% if cond %}{% let val = "a" %}{% else %}{% let val = "b" %}{% endif %}
{{ val }}
```

Shadowing supported. Scoped to current block.

## Expressions

**Access:** `{{ foo.bar }}` `{{ list[0] }}` `{{ foo.method() }}`  
**Arithmetic:** `+` `-` `*` `/` `%`  
**Comparison:** `==` `!=` `<` `>` `<=` `>=`  
**Logical:** `&&` `||` `!`  
**Bitwise:** `bitand` `bitor` `xor` `<<` `>>`  
**Cast:** `{{ val as i32 }}`  
**Concat:** `{{ a ~ b ~ c }}` (spaces required around `~`)  
**Ref/Deref:** `{{ &val }}` `{{ *val }}`

⚠️ **CRITICAL:** `|` with spaces = bitwise OR. No spaces = filter.
```html
{{ a | b }}   {# bitwise OR #}
{{ a|b }}     {# filter application #}
```

**Closures:** `{{ (closure_field)(arg) }}` — parens required  
**Functions:** `{{ self::func() }}` `{{ super::mod::func() }}` — path required for non-methods  
**Rust macros:** `{{ vec![1,2].len() }}` — macros don't capture `self`; use `{{ my_macro!(self.field) }}`

## Filters

**Syntax:** `{{ val|filter }}` `{{ val|filter(arg) }}` `{{ val|f1|f2 }}`  
**Named args:** `{{ n|pluralize(plural="ies") }}`

| Filter | Description |
|--------|-------------|
| `e` / `escape` | HTML escape |
| `safe` | Disable escaping |
| `lower` / `lowercase` | Lowercase |
| `upper` / `uppercase` | Uppercase |
| `capitalize` | First char upper, rest lower |
| `title` / `titlecase` | Title Case |
| `trim` | Strip whitespace |
| `truncate(n)` | Clip to n chars + `…` |
| `center(w)` | Center in width |
| `indent(w)` / `indent(prefix)` | Indent lines |
| `join(sep)` | Join iterator |
| `pluralize` / `pluralize(s,p)` | `""` for ±1, else `"s"` |
| `linebreaks` | `\n` → `<br>`, `\n\n` → `<p>` |
| `linebreaksbr` | `\n` → `<br>` |
| `paragraphbreaks` | `\n\n` → `<p>` only |
| `wordcount` | Count words |
| `filesizeformat` | Bytes → human readable |
| `fmt("{:?}")` / `format` | Rust format string |
| `json` | JSON serialize (feature) |
| `json_pretty` / `json_pretty(indent)` | Pretty JSON (feature) |
| `urlencode` | URL encode (keeps `/`) |
| `urlencode_strict` | URL encode (encodes `/`) |
| `assigned_or(fallback)` | Default if "empty" |
| `unique` | Remove duplicates (feature) |
| `reject(attr)` / `reject_with(fn)` | Filter out values |

**Filter blocks:**
```html
{% filter lower %}
  {{ mixed_case }} / HELLO
{% endfilter %}
{% filter lower|capitalize %}...{% endfilter %}
```

## Control Flow

### If/Else
```html
{% if x == 1 %}A{% else if x == 2 %}B{% else %}C{% endif %}
{% if let Some(v) = opt %}{{ v }}{% endif %}
```

### For Loops
```html
{% for item in items %}
  {{ loop.index }}   {# 1-based #}
  {{ loop.index0 }}  {# 0-based #}
  {{ loop.first }}   {# bool #}
  {{ loop.last }}    {# bool #}
{% else %}
  Empty
{% endfor %}

{% for x in list if x.active %}...{% endfor %}
```

### Match (Must Be Exhaustive)
```html
{% match value %}
  {% when Some with (x) %}{{ x }}
  {% when None %}Nothing
{% endmatch %}

{% match result %}
  {% when Ok(v) %}{{ v }}
  {% when Err(_) %}Error
{% endmatch %}

{% match num %}
  {% when 1 | 2 | 3 %}Small
  {% when n %}Number: {{ n }}
{% endmatch %}

{# Struct variants #}
{% match item %}
  {% when Variant { field: val } %}{{ val }}
  {% else %}default
{% endmatch %}
```

⚠️ Must cover all cases. Use `{% else %}` for catch-all (`_`).

## Template Composition

### Inheritance
**Base (base.html):**
```html
<!DOCTYPE html>
<title>{% block title %}Default{% endblock %}</title>
{% block content %}{% endblock %}
```

**Child:**
```html
{% extends "base.html" %}
{% block title %}{{ super() }} - Page{% endblock %}
{% block content %}Hello{% endblock %}
```

⚠️ `{% extends %}` must be first tag. Blocks only at top-level or inside other blocks (not in loops/ifs).

### Include
```html
{% include "partial.html" %}
{% for item in items %}{% include "item.html" %}{% endfor %}
```
Shares current context. Path must be string literal.

### Macros
```html
{% macro input(name, val="") %}
  <input name="{{ name }}" value="{{ val }}">
{% endmacro %}

{% call input("user") %}
{% call input(name="email", val="test@example.com") %}
```

**With caller block:**
```html
{% macro wrapper() %}
  <div class="box">{{ caller() }}</div>
{% endmacro %}

{% call wrapper() %}
  Inner content here
{% endcall %}
```

## Struct Configuration

```rust
#[derive(Template)]
#[template(path = "template.html")]  // OR source = "inline"
struct MyTemplate { field: String }
```

| Attribute | Description |
|-----------|-------------|
| `path = "..."` | Template file path (relative to `templates/`) |
| `source = "..."` | Inline template string |
| `ext = "html"` | Extension (required with `source`) |
| `escape = "html"` | `"html"` (default for .html/.xml), `"none"` |
| `print = "code"` | Debug: `"none"`, `"ast"`, `"code"`, `"all"` |
| `block = "name"` | Render single block only |
| `blocks = ["a","b"]` | Generate `as_a()`, `as_b()` methods |
| `syntax = "custom"` | Use custom syntax from config |
| `config = "path"` | Custom config file path |
| `in_doc = true` | Template in doc comment (` ```askama `) |

## Escaping

Default: HTML entities escaped for `.html`, `.htm`, `.xml`  
Characters: `<` `>` `&` `"` `'`

```html
{{ user_input }}         {# escaped #}
{{ raw_html|safe }}      {# NOT escaped #}
{{ val|e }}              {# force escape #}
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `{{ x | filter }}` | `{{ x|filter }}` — no spaces around `|` |
| `{{ optional }}` | `{% match optional %}...{% endmatch %}` |
| Non-exhaustive match | Add `{% else %}` case |
| `{{ my_macro!(x) }}` | `{{ my_macro!(self.x) }}` — explicit self |
| `{{ func() }}` for free fn | `{{ self::func() }}` — use path |
| `{{ closure(x) }}` | `{{ (closure)(x) }}` — wrap field |
| `{{ -2|abs }}` | `{{ (-2)|abs }}` — parens for negative |
| Block in loop | Move block to top-level |
| Recursive include | Use iterator + `{{ item }}` with nested Template |

## Anti-Hallucination Checklist

1. **No `abs`, `into_f64`, `into_isize`, `reverse` filters** — these don't exist
2. **Binary ops renamed:** Use `bitand`/`bitor`/`xor`, not `&`/`|`/`^`
3. **Filter = no spaces:** `{{ x|trim }}` not `{{ x | trim }}`
4. **Match exhaustive:** Always include `{% else %}` or cover all variants
5. **Blocks top-level only:** Not inside `{% for %}` or `{% if %}`
6. **Macros don't capture self:** Pass `self.field` explicitly to Rust macros
7. **No recursive self-include:** Template can't include itself
8. **Mut vars:** `{% let mut x %}` — mut keyword supported
9. **`{% set %}` exists:** Jinja compatibility alias for `{% let %}`
10. **Struct variants:** `{% when Variant { field } %}` — curly braces for struct
