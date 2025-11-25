import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'whoami',
  description: 'Display information about yourself'
}

export async function execute(interaction) {
  const user = interaction.user
  const member = interaction.guild?.members.cache.get(user.id)

  const fields = [
    { name: 'Discord Tag', value: user.tag, inline: true },
    { name: 'User ID', value: user.id, inline: true },
    {
      name: 'Account Created',
      value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
      inline: true
    }
  ]

  if (member) {
    fields.push({
      name: 'Joined Server',
      value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
      inline: true
    })
    if (member.nickname) {
      fields.push({ name: 'Nickname', value: member.nickname, inline: true })
    }
  }

  const embed = new EmbedBuilder()
    .setTitle('👤 Your Information')
    .addFields(fields)
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setColor('Blue')
    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: user.displayAvatarURL() })
    .setTimestamp()
  await interaction.reply({ embeds: [embed], flags: 64 })
}
