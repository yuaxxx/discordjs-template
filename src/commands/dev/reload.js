import { EmbedBuilder } from 'discord.js'

// Metadata dla loadera i slash deploya
export const data = {
  name: 'reload',
  description: 'Przeładuj wskazaną komendę (dev only)',
  options: [
    {
      type: 3, // STRING
      name: 'command',
      description: 'Nazwa komendy do przeładowania',
      required: true
    }
  ]
}

export const perm = ['dev']

export async function execute(interaction) {
  // Dev-check, prosty hardkod/ownerId, czy custom perms z systemu
  const ownerId = process.env.OWNER_ID // wrzuć do .env
  if(interaction.user.id !== ownerId)
    return await interaction.reply({ content: `🛑 Nie masz uprawnień!`, flags: 64 })

  const commandName = interaction.options.getString('command')

  const cmd =
    interaction.client.commands.get(commandName) ||
    interaction.client.commands.get(interaction.client.aliases.get(commandName))

  if (!cmd)
    return await interaction.reply({ content: `❌ Komenda nie istnieje: ${commandName}`, flags: 64 })

  try {
    await interaction.client.loader.reload(commandName)
    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Przeładowanie komendy', iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`Komenda **${commandName}** przeładowana!`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setColor('Green')

    await interaction.reply({ embeds: [embed], flags: 64 })
  } catch (err) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Błąd przy przeładowaniu', iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`❌ Błąd: ${err.message ?? err}`)
      .setColor('Red')
      .setTimestamp()
    await interaction.reply({ embeds: [embed], flags: 64 })
  }
}
