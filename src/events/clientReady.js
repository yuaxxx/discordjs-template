import { log } from '../utils/logger.util.js'
export default function clientReady(client) {
  log.ready(`[READY] Zalogowano jako ${client.user.tag}`)
}
