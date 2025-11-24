import { EmbedBuilder } from 'discord.js'

// Slash command metadata
export const data = {
  name: 'help',
  description: 'Display list of commands or details about a specific command',
  options: [
    {
      type: 3, // STRING
      name: 'command',
      description: 'Command name (optional)',
      required: false
    }
  ]
}

export async function execute(interaction) {
  // Optional argument: /help [command]
  const cmdName = interaction.options.getString('command')

  if (!cmdName) {
    // List all commands - grouped by folder categories
    const allCommands = Array.from(interaction.client.commands.values())
    const categories = {}

    // Categorize commands by folder
    allCommands.forEach(cmd => {
      const folder = cmd.folder || 'General'
      if (!categories[folder]) categories[folder] = []
      categories[folder].push(cmd)
    })

    const fields = Object.entries(categories).map(([cat, cmds]) => ({
      name: cat.toUpperCase(),
      value: cmds.length ? cmds.map(c => `\`${c.data.name}\``).join(' | ') : 'In development'
    }))

    const embed = new EmbedBuilder()
      .setTitle('Help - Available Commands')
      .addFields(fields)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setColor('Blue')
      .setTimestamp()

    return await interaction.reply({ embeds: [embed], flags: 64 })
  } else {
    // Search for command by name or alias
    let command =
      interaction.client.commands.get(cmdName.toLowerCase()) ||
      Array.from(interaction.client.commands.values()).find(
        c => c.aliases && c.aliases.includes(cmdName.toLowerCase())
      )
    if (!command) {
      const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('Command not found! Try without arguments to see all commands.')
        .setColor('Red')
      return await interaction.reply({ embeds: [embed], flags: 64 })
    }

    const embed = new EmbedBuilder()
      .setTitle(`Command Information: ${command.data.name}`)
      .addFields([
        {
          name: 'Command',
          value: `\`${command.data.name}\``
        },
        {
          name: 'Aliases',
          value: command.aliases ? `\`${command.aliases.join('` `')}\`` : 'None'
        },
        {
          name: 'Example Usage',
          value: command.data.usage
            ? `\`${command.data.name} ${command.data.usage}\``
            : `\`/${command.data.name}\``
        },
        {
          name: 'Description',
          value: command.data.description || 'No description available.'
        },
        {
          name: 'Required Permission',
          value: command.perm ? command.perm.join(', ') : 'None'
        }
      ])
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setColor('Green')
      .setTimestamp()

    return await interaction.reply({ embeds: [embed], flags: 64 })
  }
}
