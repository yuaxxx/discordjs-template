import { EmbedBuilder } from 'discord.js'

// Metadata dla slash deploya
export const data = {
  name: 'help',
  description: 'Wyświetl listę komend lub szczegóły konkretnej komendy',
  options: [
    {
      type: 3, // STRING
      name: 'command',
      description: 'Nazwa komendy (opcjonalnie)',
      required: false
    }
  ]
}

export async function execute(interaction) {
  // Optional arg: /help [komenda]
  const cmdName = interaction.options.getString('command')

  if (!cmdName) {
    // Lista wszystkich komend – z podziałem na foldery, jeśli masz kategorie
    const allCommands = Array.from(interaction.client.commands.values())
    const categories = {}

    // Kategoryzacja – folder property możesz zapisać przy loaderze!
    allCommands.forEach(cmd => {
      const folder = cmd.folder || 'Główne'
      if (!categories[folder]) categories[folder] = []
      categories[folder].push(cmd)
    })

    const fields = Object.entries(categories).map(([cat, cmds]) => ({
      name: cat.toUpperCase(),
      value: cmds.length ? cmds.map(c => `\`${c.data.name}\``).join(' | ') : 'W trakcie robienia'
    }))

    const embed = new EmbedBuilder()
      .setTitle('Pomoc – dostępne komendy')
      .addFields(fields)
      .setFooter({ text: `Wykonano przez ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setColor('Yellow')
      .setTimestamp()

    return await interaction.reply({ embeds: [embed], flags: 64 })
  } else {
    // Szukaj komendy po name/alias
    let command =
      interaction.client.commands.get(cmdName.toLowerCase()) ||
      Array.from(interaction.client.commands.values())
        .find(c => c.aliases && c.aliases.includes(cmdName.toLowerCase()))
    if (!command) {
      const embed = new EmbedBuilder()
        .setTitle('Błąd')
        .setDescription('Nie znaleziono takiej komendy! Spróbuj bez argumentu aby zobaczyć wszystkie.')
        .setColor('Red')
      return await interaction.reply({ embeds: [embed], flags: 64 })
    }

    const embed = new EmbedBuilder()
      .setTitle(`Informacje o komendzie ${command.data.name}`)
      .addFields([
        {
          name: 'Komenda',
          value: `\`${command.data.name}\``,
        },
        {
          name: 'Aliasy',
          value: command.aliases ? `\`${command.aliases.join('` `')}\`` : 'Brak',
        },
        {
          name: 'Przykładowe użycie',
          value: command.data.usage
            ? `\`${command.data.name} ${command.data.usage}\``
            : `\`${command.data.name}\``,
        },
        {
          name: 'Opis',
          value: command.data.description || 'Brak.',
        },
        {
          name: 'Wymagana Permisja',
          value: command.perm ? command.perm.join(', ') : 'Brak.',
        }
      ])
      .setFooter({ text: `Wykonano przez ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setColor('Green')
      .setTimestamp()

    return await interaction.reply({ embeds: [embed], flags: 64 })
  }
}
