import { log } from "../utils/logger.util.js"
import { readdirSync } from "fs"
import path from "path"

/**
 * Modular event handler - automatically loads all events from src/events/
 * Event name is derived from filename (e.g., interactionCreate.js -> 'interactionCreate')
 * Each event file must export a default function that receives (client, ...eventArgs)
 */
export default async function loadEvents(client) {
  const eventsDir = path.resolve("src/events")
  const files = readdirSync(eventsDir).filter(fn => fn.endsWith(".js"))

  for (const file of files) {
    const eventName = file.replace(/\.js$/, '')
    const modulePath = path.join(eventsDir, file)
    // Dynamic ESM import with file:// protocol
    const eventModule = await import(`file://${modulePath}`)
    const handler = eventModule.default

    if (typeof handler !== "function") {
      console.warn(`Event file ${file} does not export a function as default - skipping`)
      continue
    }
    client.on(eventName, handler.bind(null, client))
    log.ready(`Loaded event: ${eventName}`)
  }
}
