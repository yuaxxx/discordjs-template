import { EmbedBuilder, PermissionsBitField } from 'discord.js'

export default async function messageCreate(client, message) {
  // Ignore boty i DM
  if (message.author.bot || !message.guild) return

  // Pobierz prefix z configu/env (automatycznie, nie hardcodej)
  const prefix = process.env.PREFIX || '!'

  // Mention reply: „Mój prefix to ...”
  const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`)
  if (message.content.match(mentionRegex)) {
    return message.reply({ content: `Mój prefix to \`${prefix}\``, allowedMentions: { repliedUser: false } })
  }

  // Sprawdź czy zaczyna się od prefixu
  if (!prefix || !message.content.startsWith(prefix)) return

  // Parsowanie args, komendy
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const cmd = args.shift()?.toLowerCase()
  if (!cmd) return

  // Szukaj komendy po name/alias (prefix handler operuje na innej mapie niż slash)
  const command = client.commands.get(cmd) ||
    client.commands.get(client.aliases.get(cmd))
  if (!command) return

  // Bot musi mieć EMBED_LINKS
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) {
    return message.reply('Bot nie ma permisji wysyłania embedów!')
  }

  // Permission check (user)
  if (command.perm && !process.env.OWNER_ID.split(',').includes(message.author.id)) {
    let block = false
    for (const perm of command.perm) {
      if (perm === 'dev' && !process.env.OWNER_ID.split(',').includes(message.author.id)) {
        const errEmbed = new EmbedBuilder()
          .setAuthor({ name: 'Błąd!' })
          .setColor('Red')
          .setDescription('Ta komenda jest dla programistów/devów.')
          .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
        await message.reply({ embeds: [errEmbed] })
        block = true
        break
      } else if (perm !== 'dev' && !message.member.permissions.has(PermissionsBitField.Flags[perm])) {
        const errEmbed = new EmbedBuilder()
          .setAuthor({ name: 'Błąd!' })
          .setColor('Red')
          .setDescription(`Nie masz permisji [${perm}] aby użyć tej komendy!`)
          .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
        await message.reply({ embeds: [errEmbed] })
        block = true
        break
      }
    }
    if (block) return
  }

  // Permission check (bot)
  if (command.botperm) {
    let block = false
    for (const perm of command.botperm) {
      if (perm !== 'dev' && !message.guild.members.me.permissions.has(PermissionsBitField.Flags[perm])) {
        const errEmbed = new EmbedBuilder()
          .setAuthor({ name: 'Błąd!' })
          .setColor('Red')
          .setDescription(`Bot nie ma permisji [${perm}] aby wykonać tę komendę!`)
          .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
        await message.reply({ embeds: [errEmbed] })
        block = true
        break
      }
    }
    if (block) return
  }

  // Run komendy (legacy, przekazujesz context i helpers)
  command.run({
    client,
    message,
    args,
    prefix,
    command,
    EmbedBuilder
  }).catch(err => {
    console.error(err)
    const errEmbed = new EmbedBuilder()
      .setTitle('ERROR!')
      .setDescription(`${err}`)
      .setColor('Red')
      .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
    message.reply({ embeds: [errEmbed] })
  })
}
