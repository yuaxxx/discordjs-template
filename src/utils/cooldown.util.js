import { Collection } from 'discord.js'

/**
 * Simple cooldown manager for commands
 * Prevents spam and rate limiting issues
 *
 * Usage:
 * const cooldown = new CooldownManager()
 * if (cooldown.isOnCooldown(userId, commandName)) {
 *   // User is on cooldown
 * } else {
 *   cooldown.setCooldown(userId, commandName, duration)
 * }
 */
export class CooldownManager {
  constructor() {
    // Map<commandName, Map<userId, expirationTimestamp>>
    this.cooldowns = new Collection()
    this.cleanupTimers = new Map()

    // Periodic cleanup every 5 minutes to prevent memory leaks
    this.cleanupInterval = setInterval(
      () => {
        this.performCleanup()
      },
      5 * 60 * 1000
    )
  }

  /**
   * Perform cleanup of expired cooldowns
   * Called periodically to prevent memory leaks
   */
  performCleanup() {
    const now = Date.now()
    for (const [commandName, userCooldowns] of this.cooldowns) {
      for (const [userId, expirationTime] of userCooldowns) {
        if (now >= expirationTime) {
          userCooldowns.delete(userId)
        }
      }
      // Remove empty command cooldown maps
      if (userCooldowns.size === 0) {
        this.cooldowns.delete(commandName)
      }
    }
  }

  /**
   * Check if a user is on cooldown for a specific command
   * @param {string} userId - Discord user ID
   * @param {string} commandName - Command name
   * @returns {boolean} True if user is on cooldown
   */
  isOnCooldown(userId, commandName) {
    if (!this.cooldowns.has(commandName)) {
      return false
    }

    const userCooldowns = this.cooldowns.get(commandName)
    if (!userCooldowns.has(userId)) {
      return false
    }

    const expirationTime = userCooldowns.get(userId)
    if (Date.now() >= expirationTime) {
      userCooldowns.delete(userId)
      return false
    }

    return true
  }

  /**
   * Get remaining cooldown time in seconds
   * @param {string} userId - Discord user ID
   * @param {string} commandName - Command name
   * @returns {number} Remaining time in seconds, or 0 if not on cooldown
   */
  getRemainingTime(userId, commandName) {
    if (!this.isOnCooldown(userId, commandName)) {
      return 0
    }

    const userCooldowns = this.cooldowns.get(commandName)
    const expirationTime = userCooldowns.get(userId)
    return Math.ceil((expirationTime - Date.now()) / 1000)
  }

  /**
   * Set a cooldown for a user on a specific command
   * @param {string} userId - Discord user ID
   * @param {string} commandName - Command name
   * @param {number} duration - Cooldown duration in seconds
   */
  setCooldown(userId, commandName, duration) {
    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection())
    }

    const userCooldowns = this.cooldowns.get(commandName)
    const expirationTime = Date.now() + duration * 1000

    userCooldowns.set(userId, expirationTime)
  }

  /**
   * Clear all cooldowns for a specific user
   * @param {string} userId - Discord user ID
   */
  clearUserCooldowns(userId) {
    for (const [, userCooldowns] of this.cooldowns) {
      userCooldowns.delete(userId)
    }
  }

  /**
   * Clear all cooldowns for a specific command
   * @param {string} commandName - Command name
   */
  clearCommandCooldowns(commandName) {
    this.cooldowns.delete(commandName)
  }

  /**
   * Clear all cooldowns and stop cleanup interval
   */
  clearAll() {
    this.cooldowns.clear()
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}
