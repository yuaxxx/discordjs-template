import chalk from 'chalk'
const { blueBright, redBright, yellowBright, greenBright } = chalk

/**
 * Formats timestamp in Polish locale (DD.MM.YYYY HH:mm:ss)
 * Uses native Intl.DateTimeFormat for proper timezone handling
 */
function formatDate() {
  return (
    new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date()) +
    ' (' +
    new Intl.DateTimeFormat('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date()) +
    ')'
  )
}

export class Log {
  ready(content) {
    console.log(greenBright(`[${formatDate()}] ${content}`))
  }
  warn(content) {
    console.log(yellowBright(`[${formatDate()}] ${content}`))
  }
  error(content) {
    console.log(redBright(`[${formatDate()}] ${content}`))
  }
  log(content) {
    console.log(blueBright(`[${formatDate()}] ${content}`))
  }
}

/**
 * Logger singleton instance
 * Import and use: import { log } from './utils/logger.util.js'
 * Available methods: log.ready(), log.warn(), log.error(), log.log()
 */
export const log = new Log()
