# Discord.js v14 Bot Template

Production-ready Discord bot template built with modern JavaScript practices. Features hot-reload command system, modular architecture, comprehensive error handling, and multi-guild deployment support.

## Features

- **Pure ESM** – No CommonJS, native ES modules throughout
- **Hot-reload commands** – Modify and reload commands without bot restart (`/reload`)
- **Modular architecture** – Handlers, events, commands separated into logical folders
- **Error handling** – Global wrapper prevents crashes from command errors
- **Multi-guild ready** – Switch between dev (guild) and prod (global) command deployment
- **Slash commands** – Full Discord.js v14 interaction support
- **Aliases** – Map multiple command names to same handler
- **Permission system** – Role-based and owner-only command restrictions
- **TypeScript-ready** – Structured for easy TS migration

## Tech Stack

- **Node.js** v18+
- **discord.js** v14.25.1
- **chalk** v5 (ESM logger styling)
- **dotenv** (environment configuration)

## Project Structure

```
discord.js-template/
├── src/
│   ├── commands/          # Command modules organized by category
│   │   ├── dev/           # Developer-only commands (eval, reload)
│   │   ├── info/          # Information commands (help, ping)
│   │   └── utils/         # Utility commands (uptime, whoami)
│   ├── events/            # Discord event handlers
│   │   ├── clientReady.js
│   │   ├── interactionCreate.js
│   │   └── messageCreate.js
│   ├── handlers/          # Module loaders
│   │   ├── command.handler.js
│   │   └── event.handler.js
│   ├── utils/             # Core utilities
│   │   ├── errorhandler.util.js
│   │   ├── loader.util.js
│   │   └── logger.util.js
│   └── index.js           # Entry point
├── .env.example           # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- Discord application/client ID

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuaxxx/discord.js-template.git
   cd discord.js-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   BOT_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_test_guild_id
   OWNER_ID=your_discord_user_id
   DEPLOYMENT_MODE=dev
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `BOT_TOKEN` | Discord bot token | ✅ | - |
| `CLIENT_ID` | Discord application ID | ✅ | - |
| `GUILD_ID` | Guild ID for dev deployment | ⚠️ Dev only | - |
| `OWNER_ID` | Comma-separated owner user IDs | ✅ | - |
| `DEPLOYMENT_MODE` | `dev` (guild) or `prod` (global) | ❌ | `dev` |
| `PREFIX` | Legacy prefix commands | ❌ | `!` |

## Command Development

### Creating a New Command

1. **Create command file** in appropriate category folder (e.g., `src/commands/info/example.js`)

```javascript
import { EmbedBuilder } from 'discord.js'

// Slash command metadata for Discord API
export const data = {
  name: 'example',
  description: 'Example command description',
  options: [
    {
      type: 3, // STRING
      name: 'input',
      description: 'Example input parameter',
      required: false
    }
  ]
}

// Optional: Command aliases
export const aliases = ['ex', 'demo']

// Optional: Permission requirements
export const perm = ['dev'] // or ['ManageMessages', 'Administrator']

// Optional: Cooldown in seconds (prevents spam)
export const cooldown = 5

// Command execution logic
export async function execute(interaction) {
  const input = interaction.options.getString('input') || 'default'
  
  const embed = new EmbedBuilder()
    .setTitle('Example Command')
    .setDescription(`You provided: ${input}`)
    .setColor('Blue')
    .setTimestamp()
  
  await interaction.reply({ embeds: [embed], flags: 64 }) // 64 = ephemeral
}
```

2. **Restart bot** or use `/reload example` to load without restart

### Command File Exports

- **`data`** (required) – Slash command structure ([Discord API reference](https://discord.com/developers/docs/interactions/application-commands))
- **`execute`** (required) – Async function receiving `interaction` parameter
- **`aliases`** (optional) – Array of alternative command names
- **`perm`** (optional) – Array of required permissions (`['dev']` or Discord permission flags)
- **`cooldown`** (optional) – Cooldown duration in seconds (prevents spam)

## Deployment Modes

### Development Mode (`dev`)
- Commands deploy to single guild (instant update)
- Requires `GUILD_ID` in `.env`
- Use for testing and development

### Production Mode (`prod`)
- Commands deploy globally (all guilds)
- Takes up to 1 hour to propagate
- Remove `GUILD_ID` requirement

Set via `.env`:
```env
DEPLOYMENT_MODE=prod
```

## Architecture

### CommandLoader (`src/utils/loader.util.js`)

Handles dynamic command loading, unloading, and hot-reload:

```javascript
const loader = new CommandLoader(client)
await loader.load({ file: 'ping.js', dir: './commands/info' })
await loader.reload('ping')
await loader.unload('ping')
```

- Recursive folder scanning
- Cache-bust imports for hot-reload
- Automatic error handler wrapping
- Alias conflict detection

### Error Handler (`src/utils/errorhandler.util.js`)

Wraps all command execute functions to prevent crashes:

- Catches unhandled errors in commands
- Sends error embed to user (ephemeral)
- Handles double-reply scenarios (Discord API error 40060)
- Logs errors without exposing stack traces to users

### Event System (`src/handlers/event.handler.js`)

Auto-loads events from filenames:
- `clientReady.js` → `client.on('clientReady', ...)`
- `interactionCreate.js` → `client.on('interactionCreate', ...)`

Each event file exports default function: `(client, ...eventArgs) => {}`

## Multi-Guild Considerations

### Current State
- ✅ Modular architecture supports multi-guild
- ✅ Deployment mode switchable (dev/prod)
- ✅ No hardcoded guild IDs in command logic
- ⚠️ No database/persistence layer
- ⚠️ No guild-specific config storage

### Production Recommendations
1. **Add database layer** (PostgreSQL, MongoDB) for:
   - Guild-specific settings
   - User data persistence
   - Command usage analytics

2. **Implement guild config system**:
   ```javascript
   const guildConfig = await db.getGuildConfig(interaction.guildId)
   const prefix = guildConfig.prefix || '!'
   ```

3. **Use `DEPLOYMENT_MODE=prod`** for global deployment

4. **Monitor rate limits** with global commands (5 deploys/day)

## Built-in Commands

| Command | Category | Description | Cooldown |
|---------|----------|-------------|----------|
| `/ping` | info | Check bot latency and API response time | 5s |
| `/help` | info | Command list and details | - |
| `/serverinfo` | info | Display server information | 10s |
| `/uptime` | utils | Bot uptime duration | - |
| `/whoami` | utils | User information | - |
| `/eval` | dev | Execute JavaScript (owner-only) | - |
| `/reload` | dev | Hot-reload command (owner-only) | - |

## Development

### Watch Mode (Node 18+)
```bash
npm run dev  # Auto-restart on file changes
```

### Adding Event Handlers

Create `src/events/yourEvent.js`:
```javascript
export default function yourEvent(client, ...args) {
  // Event handler logic
}
```

File name must match Discord.js event name.

## Troubleshooting

### Commands not registering
- Verify `CLIENT_ID` and `BOT_TOKEN` are correct
- Check bot has `applications.commands` scope
- In dev mode, ensure `GUILD_ID` is set

### Error: "Interaction has already been acknowledged"
- Error handler prevents this crash
- Check for multiple `reply()` calls in command logic

### Commands delayed in production
- Global commands take up to 1 hour to update
- Use dev mode (`GUILD_ID` + `DEPLOYMENT_MODE=dev`) for testing

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Discord.js Guide](https://discordjs.guide/)

---

**Template maintained for Discord.js v14+ | ESM-first architecture**
