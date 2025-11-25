import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import loadCommands from './handlers/command.handler.js'
import loadEvents from './handlers/event.handler.js'
import { CommandLoader } from './utils/loader.util.js'
import { CooldownManager } from './utils/cooldown.util.js'
import { log } from './utils/logger.util.js'
import { validateEnv } from './utils/config.util.js'

dotenv.config()

// Validate environment configuration before starting
try {
  validateEnv()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

const loader = new CommandLoader(client)
const cooldowns = new CooldownManager()

client.loader = loader
client.cooldowns = cooldowns

// Load commands and events
await loadCommands(client, loader)
await loadEvents(client)

// Deploy slash commands to Discord API
const commandsToRegister = Array.from(client.commands.values()).map(cmd => cmd.data)
const restClient = new REST().setToken(process.env.BOT_TOKEN)

// Determine deployment mode: guild (dev, fast update) or global (prod, ~1h delay)
const deploymentMode = process.env.DEPLOYMENT_MODE || 'dev'
const route =
  deploymentMode === 'prod'
    ? Routes.applicationCommands(process.env.CLIENT_ID)
    : Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)

try {
  await restClient.put(route, { body: commandsToRegister })
  log.ready(`Slash commands deployed successfully (${deploymentMode} mode)`)
} catch (err) {
  log.error(`Failed to deploy slash commands: ${err}`)
}

client.login(process.env.BOT_TOKEN)
