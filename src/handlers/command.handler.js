import { readdirSync } from "fs"
import path from "path"

/**
 * Command handler - loads all commands from src/commands/ recursively
 * Supports nested folder structure for command organization (e.g., dev/, info/, utils/)
 * Each command file must export: data (slash command metadata), execute (handler function)
 * Optional exports: aliases (string array), perm (permission requirements)
 */
export default async function loadCommands(client, loader) {
  const baseDir = path.resolve("src/commands/")
  const folders = readdirSync(baseDir)
    .filter(f => !f.startsWith("."))
  for (const folder of folders) {
    const cmdDir = path.join(baseDir, folder)
    const files = readdirSync(cmdDir)
      .filter(f => f.endsWith(".js"))
    for (const file of files) {
      const dir = path.join(cmdDir, file)
      await loader.load({ file, folder, dir }) // loader uses dynamic import
    }
  }
}
