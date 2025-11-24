// src/commands/whoami.js
import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'whoami',
  description: 'Pokazuje info o Tobie'
}

export async function execute(interaction) {
  const user = interaction.user
  const embed = new EmbedBuilder()
    .setTitle('Twoje Info')
    .addFields([
      { name: 'Discord Tag', value: user.tag, inline: true },
      { name: 'ID', value: user.id, inline: true }
    ])
    .setThumbnail(user.displayAvatarURL())
    .setColor('Blue')
    .setFooter({ text: `Wykonano przez ${interaction.user.tag}`, iconURL: user.displayAvatarURL() })
    .setTimestamp()
  await interaction.reply({ embeds: [embed], flags: 64 })
}
