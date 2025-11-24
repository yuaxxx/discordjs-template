import { log } from './logger.util.js'
import { readdirSync, statSync, existsSync } from 'fs'
import path from 'path'
import { errorHandler } from './errorhandler.util.js'

export class CommandLoader {
  constructor(client) {
    this.client = client
    this.commandsDir = path.resolve('src/commands')
    this.client.commands = new Map()
    this.client.aliases = new Map()
    this.client.loader = this
  }

  async loadAll() {
    // Recursively scan all subdirectories for .js command files
    const scanDir = async (dir) => {
      const entries = readdirSync(dir)
      for (const entry of entries) {
        const fullPath = path.join(dir, entry)
        const isDir = statSync(fullPath).isDirectory()
        if (isDir) {
          await scanDir(fullPath) // Recursive subfolder traversal
        } else if (entry.endsWith('.js')) {
          await this.load({ file: entry, dir: fullPath })
        }
      }
    }
    await scanDir(this.commandsDir)
  }

  async load({ file, dir }) {
    try {
      const resolvedDir = dir && typeof dir === 'string'
        ? dir
        : path.join(this.commandsDir, file)
      if (!resolvedDir || typeof resolvedDir !== 'string' || !existsSync(resolvedDir)) {
        throw `Nieprawidłowa ścieżka do komendy: ${resolvedDir} (file: ${file})`
      }
      const fileUrl = `file://${path.resolve(resolvedDir)}`
      // Cache-bust dynamic import to enable hot-reload
      const commandModule = await import(fileUrl + `?update=${Date.now()}`)

      const { data, execute, aliases } = commandModule

      if (!data?.name || !execute) throw 'Missing required exports: data.name or execute function'

      // Extract folder name for help command categorization
      const folderName = path.basename(path.dirname(resolvedDir))

      // Wrap execute function with global error handler to prevent crashes
      const safeExecute = errorHandler(execute)

      this.client.commands.set(data.name, { 
        ...commandModule, 
        execute: safeExecute, 
        file, 
        dir: resolvedDir,
        folder: folderName
      })

      if (aliases && Array.isArray(aliases)) {
        aliases.forEach(alias => {
          if (this.client.aliases.get(alias))
            throw `Alias conflict: ${alias} is already registered to ${this.client.aliases.get(alias)}`
          this.client.aliases.set(alias, data.name)
        })
      }
      log.ready(`Loaded command: ${data.name}`)
      return data.name
    } catch (e) {
      log.error(`Failed to load ${file}: ${e}`)
      return null
    }
  }

  async unload(name) {
    try {
      const command = this.client.commands.get(name) ||
        this.client.commands.get(this.client.aliases.get(name))
      if (!command) throw 'Command not found in registry'

      this.client.commands.delete(command.data.name)
      if (command.aliases)
        command.aliases.forEach(alias => this.client.aliases.delete(alias))

      log.warn(`Unloaded command: ${command.file}`)
    } catch (e) {
      log.error(`Failed to unload ${name}: ${e}`)
    }
  }

  async reload(name) {
    const cmd =
      this.client.commands.get(name) ||
      this.client.commands.get(this.client.aliases.get(name))

    if (!cmd) {
      throw `Command ${name} is not loaded, cannot reload`
    }

    const commandPath = cmd.dir

    await this.unload(name)
    await this.load({ file: path.basename(commandPath), dir: commandPath })
  }
}
