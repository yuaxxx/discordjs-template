import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'serverinfo',
  description: 'Display information about the current server'
}

export const aliases = ['server', 'guildinfo']
export const cooldown = 10

export async function execute(interaction) {
  const guild = interaction.guild

  if (!guild) {
    return await interaction.reply({
      content: '❌ This command can only be used in a server!',
      flags: 64
    })
  }

  const owner = await guild.fetchOwner()
  const createdAt = Math.floor(guild.createdTimestamp / 1000)

  const embed = new EmbedBuilder()
    .setTitle(`📊 ${guild.name}`)
    .setThumbnail(guild.iconURL({ size: 256 }))
    .addFields([
      { name: '👑 Owner', value: `${owner.user.tag}`, inline: true },
      { name: '🆔 Server ID', value: guild.id, inline: true },
      { name: '📅 Created', value: `<t:${createdAt}:R>`, inline: true },
      { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
      { name: '📝 Channels', value: `${guild.channels.cache.size}`, inline: true },
      { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
      {
        name: '🛡️ Verification Level',
        value: guild.verificationLevel.toString(),
        inline: true
      },
      { name: '💬 Total Roles', value: `${guild.roles.cache.size}`, inline: true },
      {
        name: '🚀 Boost Level',
        value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`,
        inline: true
      }
    ])
    .setColor('Blue')
    .setFooter({
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp()

  await interaction.reply({ embeds: [embed], flags: 64 })
}
