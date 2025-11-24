export default async function interactionCreate(client, interaction) {
  try {
    // 1. SLASH command
    if (interaction.isChatInputCommand()) {
      const command =
        client.commands.get(interaction.commandName) ||
        client.commands.get(client.aliases.get(interaction.commandName))
      if (!command || typeof command.execute !== 'function')
        return await interaction.reply({ content: 'Command not found!', flags: 64 })

      if (command.perm && command.perm.includes('dev')) {
        const ownerIds = process.env.OWNER_ID.split(',').map(id => id.trim())
        if (!ownerIds.includes(interaction.user.id))
          return await interaction.reply({
            content: "🛑 You don't have permission to use this command!",
            flags: 64
          })
      }
      await command.execute(interaction)
    }
    // 2. CONTEXT MENU
    else if (interaction.isContextMenuCommand?.()) {
      const command =
        client.commands.get(interaction.commandName) ||
        client.commands.get(client.aliases.get(interaction.commandName))
      if (!command || typeof command.execute !== 'function')
        return await interaction.reply({ content: 'Command not found!', flags: 64 })
      await command.execute(interaction)
    }
    // 3. MESSAGE COMPONENT (BUTTON/SELECT)
    else if (interaction.isButton?.() || interaction.isSelectMenu?.()) {
      const component = client.commands.get(interaction.customId)
      if (component && typeof component.execute === 'function') await component.execute(interaction)
    }
    // 4. OTHER types (e.g., Modals)
    // Add more interaction types as needed
  } catch (err) {
    console.error('Error in interactionCreate:', err)
    // Avoid double reply errors
    if (interaction && !interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: `🛑 ERROR: ${err}`, flags: 64 })
    } else if (interaction && (interaction.replied || interaction.deferred)) {
      await interaction.editReply({ content: `🛑 ERROR: ${err}` })
    }
  }
}
