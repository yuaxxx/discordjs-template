export const data = {
  name: 'ping',
  description: 'Ping command for test',
  options: [],
}
export const aliases = ['pong', 'test']

export async function execute(interaction) {
  await interaction.reply({ content: 'Pong!', flags: 64 })
}
