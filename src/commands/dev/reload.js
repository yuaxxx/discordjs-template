import { EmbedBuilder } from 'discord.js'

// Slash command metadata for loader and deployment
export const data = {
  name: 'reload',
  description: 'Hot-reload a specific command without restarting the bot (owner only)',
  options: [
    {
      type: 3, // STRING
      name: 'command',
      description: 'Name of the command to reload',
      required: true
    }
  ]
}

export const perm = ['dev']

export async function execute(interaction) {
  // Owner validation - multiple owners supported via comma-separated IDs
  const ownerIds = process.env.OWNER_ID.split(',').map(id => id.trim())
  if (!ownerIds.includes(interaction.user.id))
    return await interaction.reply({
      content: `🛑 You don't have permission to use this command!`,
      flags: 64
    })

  const commandName = interaction.options.getString('command')

  const cmd =
    interaction.client.commands.get(commandName) ||
    interaction.client.commands.get(interaction.client.aliases.get(commandName))

  if (!cmd)
    return await interaction.reply({
      content: `❌ Command does not exist: ${commandName}`,
      flags: 64
    })

  try {
    await interaction.client.loader.reload(commandName)
    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Command Reload', iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`✅ Command **${commandName}** has been reloaded successfully!`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setColor('Green')

    await interaction.reply({ embeds: [embed], flags: 64 })
  } catch (err) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Reload Error', iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`❌ Error: ${err.message ?? err}`)
      .setColor('Red')
      .setTimestamp()
    await interaction.reply({ embeds: [embed], flags: 64 })
  }
}
