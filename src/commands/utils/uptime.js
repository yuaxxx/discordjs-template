import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'uptime',
  description: 'Display bot uptime duration'
}

export async function execute(interaction) {
  const totalSeconds = Math.floor(process.uptime())
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const embed = new EmbedBuilder()
    .setTitle('⏱️ Bot Uptime')
    .setDescription(`Bot has been running for: **${hours}h ${minutes}m ${seconds}s**`)
    .setColor('Green')
    .setFooter({
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp()
  await interaction.reply({ embeds: [embed], flags: 64 })
}
