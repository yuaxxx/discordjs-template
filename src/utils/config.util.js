/**
 * Environment configuration validator
 * Checks required environment variables on startup to prevent runtime errors
 */
export function validateEnv() {
  const required = ['BOT_TOKEN', 'CLIENT_ID', 'OWNER_ID']
  const missing = []
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  
  // Guild ID required only in dev mode
  const deploymentMode = process.env.DEPLOYMENT_MODE || 'dev'
  if (deploymentMode === 'dev' && !process.env.GUILD_ID) {
    missing.push('GUILD_ID (required for dev mode)')
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  - ${missing.join('\n  - ')}\n\n` +
      `Check your .env file against .env.example`
    )
  }
  
  return true
}
