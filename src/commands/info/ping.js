import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'ping',
  description: 'Check bot latency and API response time',
  options: []
}
export const aliases = ['pong', 'latency']
export const cooldown = 5 // 5 second cooldown

export async function execute(interaction) {
  const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, flags: 64 })
  const roundtrip = sent.createdTimestamp - interaction.createdTimestamp
  const apiLatency = Math.round(interaction.client.ws.ping)

  const embed = new EmbedBuilder()
    .setTitle('🏓 Pong!')
    .addFields([
      { name: 'Roundtrip Latency', value: `${roundtrip}ms`, inline: true },
      { name: 'WebSocket Latency', value: `${apiLatency}ms`, inline: true }
    ])
    .setColor(apiLatency < 100 ? 'Green' : apiLatency < 200 ? 'Yellow' : 'Red')
    .setTimestamp()

  await interaction.editReply({ content: '', embeds: [embed] })
}
