// src/commands/uptime.js
import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'uptime',
  description: 'Pokazuje czas działania bota'
}

export async function execute(interaction) {
  const totalSeconds = Math.floor(process.uptime())
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const embed = new EmbedBuilder()
    .setTitle('Uptime')
    .setDescription(`Bot działa od: **${hours}h ${minutes}m ${seconds}s**`)
    .setColor('Green')
    .setFooter({ text: `Wykonano przez ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    .setTimestamp()
  await interaction.reply({ embeds: [embed], flags: 64 })
}
