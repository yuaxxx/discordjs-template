import { EmbedBuilder } from 'discord.js'

export const data = {
  name: 'eval',
  description: 'Wykonuje kod JS jako dev (owner only)',
  options: [
    {
      type: 3, // STRING
      name: 'code',
      description: 'Kod do wyewaluowania',
      required: true
    }
  ]
}

export const perm = ['dev']

export async function execute(interaction) {
  // obsługa wielu ownerów
  const ownerIds = process.env.OWNER_ID.split(',').map(id => id.trim())
  if(!ownerIds.includes(interaction.user.id))
    return await interaction.reply({ content: '🛑 Tylko owner może używać evala!', flags: 64 })

  const code = interaction.options.getString('code')
  let evaled
  let output
  let errorEmbed = null

  try {
    // Bezpieczny eval, ograniczony output
    evaled = await eval(code)
    if (typeof evaled === 'object' || Array.isArray(evaled)) {
      output = JSON.stringify(evaled, (key, value) => 
        typeof value === 'bigint' ? value.toString() + 'n' : value
      , 2)
    } else {
      output = String(evaled)
    }
    if (output.length > 1900) output = output.slice(0,1900) + '...'
  } catch (err) {
    output = `ERROR:\n${err}`
  }

  // Tworzenie embeda
  const embed = new EmbedBuilder()
    .setTitle('Eval')
    .setDescription(`\`\`\`js\n${output}\n\`\`\``)
    .setColor(output.startsWith('ERROR') ? 'Red' : 'Green')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setTimestamp()

  // Puszczasz tylko JEDEN reply — errorHandler ogarnie wszelkie runtime errors
  if (!interaction.replied && !interaction.deferred) {
    await interaction.reply({ embeds: [embed], flags: 64 })
  } else {
    await interaction.editReply({ embeds: [embed] })
  }
}
