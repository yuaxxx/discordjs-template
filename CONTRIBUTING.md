# Contributing to Discord.js Template

Thank you for considering contributing to this project! This document outlines the guidelines for contributing.

## How to Contribute

### Reporting Bugs

Before creating bug reports, check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Environment details** (Node.js version, discord.js version, OS)
- **Relevant logs or error messages**

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **Clear use case** - Why is this feature needed?
- **Proposed implementation** - How should it work?
- **Alternatives considered** - Other approaches you've thought about

### Pull Requests

1. **Fork the repo** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow code style**:
   - Use ESM imports (no CommonJS)
   - Add JSDoc comments for exported functions
   - Keep functions focused and single-purpose
   - Use descriptive variable names

3. **Test your changes**:
   - Ensure bot starts without errors
   - Test commands work as expected
   - Verify hot-reload functionality

4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add user timeout command"
   git commit -m "fix: resolve double-reply error in help command"
   git commit -m "docs: update README deployment section"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style Guidelines

### File Structure
- Commands go in `src/commands/{category}/`
- Events go in `src/events/`
- Utilities go in `src/utils/`

### Command Template
```javascript
import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'commandname',
  description: 'Clear description of what command does',
  options: []
}

export const aliases = ['alias1', 'alias2'] // Optional

export const perm = ['dev'] // Optional

export async function execute(interaction) {
  // Command logic
}
```

### Naming Conventions
- **Files**: `kebab-case.js` (e.g., `error-handler.util.js`)
- **Functions**: `camelCase` (e.g., `validateEnv()`)
- **Classes**: `PascalCase` (e.g., `CommandLoader`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEPLOYMENT_MODE`)

### Comments
- Use JSDoc for function documentation
- Explain **why**, not **what** (code should be self-explanatory)
- Avoid obvious comments

```javascript
// ❌ Bad: Set user to interaction user
const user = interaction.user

// ✅ Good: Interaction user might differ from message author in context menus
const user = interaction.user
```

## Development Workflow

### Setup Development Environment
```bash
# Clone your fork
git clone https://github.com/yuaxxx/discord.js-template.git
cd discord.js-template

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your bot credentials
```

### Testing Changes
```bash
# Run bot in watch mode (Node 18+)
npm run dev

# Test commands in Discord
# Use /reload command to hot-reload changes
```

### Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```
feat: add message component support to interactionCreate

- Implement button and select menu handlers
- Add customId-based component routing
- Update README with component examples
```

## Project Structure

```
src/
├── commands/       # Slash commands (organized by category)
├── events/         # Discord.js event handlers
├── handlers/       # Module loaders (commands, events)
├── utils/          # Utility functions (logger, error handler, config)
└── index.js        # Application entry point
```

## What We're Looking For

### High Priority
- Bug fixes with clear reproduction steps
- Performance improvements
- Documentation enhancements
- TypeScript migration support

### Medium Priority
- New utility commands
- Event handler examples
- Error handling improvements

### Low Priority (discuss first)
- Major architectural changes
- New dependencies
- Breaking changes

## Questions?

Open an issue with the `question` label or reach out to maintainers.

---

**Thank you for contributing!** 🎉
