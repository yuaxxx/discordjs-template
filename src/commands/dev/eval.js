import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'eval',
  description: 'Execute JavaScript code (owner only - DANGEROUS)',
  options: [
    {
      type: 3, // STRING
      name: 'code',
      description: 'JavaScript code to evaluate',
      required: true
    }
  ]
}

export const perm = ['dev']

export async function execute(interaction) {
  // Multiple owner support via comma-separated IDs
  const ownerIds = process.env.OWNER_ID.split(',').map(id => id.trim())
  if (!ownerIds.includes(interaction.user.id))
    return await interaction.reply({ content: '🛑 Only bot owners can use eval!', flags: 64 })

  const code = interaction.options.getString('code')
  let evaled
  let output
  let errorEmbed = null

  try {
    // WARNING: eval is dangerous - only owner-accessible
    evaled = await eval(code)
    if (typeof evaled === 'object' || Array.isArray(evaled)) {
      output = JSON.stringify(
        evaled,
        (key, value) => (typeof value === 'bigint' ? value.toString() + 'n' : value),
        2
      )
    } else {
      output = String(evaled)
    }
    // Limit output length to prevent Discord message limits
    if (output.length > 1900) output = output.slice(0, 1900) + '...'
  } catch (err) {
    output = `ERROR:\n${err}`
  }

  const embed = new EmbedBuilder()
    .setTitle('Eval Result')
    .setDescription(`\`\`\`js\n${output}\n\`\`\``)
    .setColor(output.startsWith('ERROR') ? 'Red' : 'Green')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setTimestamp()

  // Single reply - errorHandler will catch any runtime errors
  if (!interaction.replied && !interaction.deferred) {
    await interaction.reply({ embeds: [embed], flags: 64 })
  } else {
    await interaction.editReply({ embeds: [embed] })
  }
}
