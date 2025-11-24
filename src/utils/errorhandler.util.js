import { EmbedBuilder } from 'discord.js'

/**
 * Global error handler wrapper for command execute functions
 * Prevents bot crashes from unhandled errors in command logic
 * Handles both pre-reply and post-reply interaction states
 * Suppresses double-reply attempts (Discord API error 40060)
 * 
 * @param {Function} fn - The command execute function to wrap
 * @returns {Function} Wrapped function with error handling
 */
export function errorHandler(fn) {
  return async function(interaction) {
    try {
      await fn(interaction)
    } catch (err) {
      const embed = new EmbedBuilder()
        .setTitle('🛑 Error')
        .setDescription(`\`\`\`js\n${err?.stack || err}\n\`\`\``)
        .setColor('Red')
        .setTimestamp()

      // Attempt reply only if interaction hasn't been acknowledged yet
      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ embeds: [embed], flags: 64 })
        } else {
          await interaction.editReply({ embeds: [embed] })
        }
      } catch (e) {
        // Discord API returns error 40060 when interaction expires or is already acknowledged
        // Log these cases instead of crashing - no user-facing action needed
        if (
          e?.code === 40060 ||
          e?.message?.includes('already been acknowledged') ||
          e?.message?.includes('Unknown interaction')
        ) {
          console.error('[errorHandler] Double reply blocked:', e)
        } else {
          // Log other unexpected errors during error reporting
          console.error('[errorHandler] Error sending embed:', e)
        }
      }
    }
  }
}
