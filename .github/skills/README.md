# Agent Skills

This directory contains skills following the [Agent Skills standard](https://agentskills.io), making them portable across different AI agents including GitHub Copilot, Claude, and other compatible agents.

## Available Skills

### 1. Code Review (`code-review`)
Automatically reviews code changes for quality, best practices, TypeScript compliance, React/Next.js patterns, and project-specific conventions.

**Activate with**: "Review my code" veya "Kod kalitesini kontrol et"

### 2. UI/UX Review (`ui-ux-review`)
Detects and fixes UI/UX issues including responsive design, accessibility (WCAG), visual consistency, and mobile-specific problems.

**Activate with**: "Review UI/UX" veya "Erişilebilirliği kontrol et"

### 3. Page Creation (`page-creation`)
Next.js App Router ile yeni sayfa oluşturma. Dashboard modülleri, loading/error durumları ve layout yapılandırması.

**Activate with**: "Yeni sayfa oluştur" veya "Create new page"

### 4. Component Creation (`component-creation`)
Proje yapısına uygun React bileşeni oluşturma. shadcn/ui, Tailwind CSS, CVA variants ve TypeScript props.

**Activate with**: "Yeni bileşen oluştur" veya "Create component"

### 5. Form Builder (`form-builder`)
React Hook Form + Zod validation ile form oluşturma. Türkçe hata mesajları ve proje form patterns'ına uygun yapı.

**Activate with**: "Form oluştur" veya "Create form"

### 6. Testing (`testing`)
Jest + React Testing Library ile unit testler ve Playwright ile E2E testler. Component, hook ve utility test şablonları.

**Activate with**: "Test yaz" veya "Write tests"

### 7. API Integration (`api-integration`)
TanStack Query ile API entegrasyonu. Custom hooks, query/mutation patterns, caching strategies ve optimistic updates.

**Activate with**: "API hook oluştur" veya "Create API integration"

## How Agent Skills Work

Skills use **progressive disclosure** for efficient context loading:

1. **Level 1 - Discovery**: AI agents always know which skills are available via the YAML frontmatter (name + description)
2. **Level 2 - Instructions**: When relevant, the agent loads the SKILL.md body into context
3. **Level 3 - Resources**: Additional files (scripts, examples) are accessed only when needed

This means skills activate automatically based on your request—no manual selection needed!

## Skill Format

Each skill follows this structure:

```
.github/skills/
  skill-name/
    SKILL.md          # Main skill definition with YAML frontmatter
    examples/         # Optional: example files
    scripts/          # Optional: helper scripts
    templates/        # Optional: templates
```

### SKILL.md Format

```markdown
---
name: skill-name
description: What the skill does and when to use it (max 1024 chars)
---

# Skill Instructions

Your detailed instructions go here...
```

## Creating New Skills

1. Create a new directory in `.github/skills/your-skill-name/`
2. Add a `SKILL.md` file with YAML frontmatter
3. Include clear instructions, checklists, and examples
4. Optionally add supporting files (scripts, templates, examples)

## Using Shared Skills

You can use community skills from:
- [github/awesome-copilot](https://github.com/github/awesome-copilot) - Community collection
- [anthropics/skills](https://github.com/anthropics/skills) - Reference skills

To use a shared skill:
1. Copy the skill directory to `.github/skills/`
2. Review and customize the SKILL.md
3. Test the skill with your workflows

## Portability

These skills work across:
- ✅ GitHub Copilot in VS Code (chat and agent mode)
- ✅ GitHub Copilot CLI (terminal usage)
- ✅ GitHub Copilot coding agent (automated tasks)
- ✅ Claude and other Agent Skills-compatible agents

## Security Note

Always review skills before using them, especially from external sources. VS Code provides controls for script execution and auto-approval with configurable allow-lists.

## Resources

- [Agent Skills Standard](https://agentskills.io)
- [VS Code Agent Skills Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
