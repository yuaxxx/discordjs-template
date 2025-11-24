# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this Discord bot template, please report it by:

1. **Email**: Contact the repository owner directly
2. **Private Issue**: Open a private security advisory on GitHub

**Please DO NOT** open a public issue for security vulnerabilities.

## Security Best Practices

### Environment Variables

**CRITICAL**: Never commit your `.env` file to version control!

- ✅ Use `.env.example` as a template
- ✅ Keep sensitive tokens in `.env` (already in `.gitignore`)
- ✅ Rotate tokens immediately if exposed
- ❌ Never hardcode tokens in source code

### Bot Token Security

1. **Keep tokens secret**: Your bot token provides full access to your bot
2. **Use environment variables**: Store `BOT_TOKEN` in `.env` file only
3. **Rotate compromised tokens**: Regenerate immediately at [Discord Developer Portal](https://discord.com/developers/applications)
4. **Limit token exposure**: Only share with trusted team members

### Owner-Only Commands

Commands with `perm: ['dev']` should only be accessible to bot owners:

- `/eval` - Executes arbitrary code (DANGEROUS)
- `/reload` - Hot-reloads commands

**Configuration**:
```env
OWNER_ID=your_user_id_here  # Comma-separated for multiple owners
```

### Eval Command Warning

The `/eval` command executes arbitrary JavaScript code and is **extremely dangerous**:

- ⚠️ Can access all bot data and environment variables
- ⚠️ Can execute system commands
- ⚠️ Can crash the bot
- ⚠️ Only for development/debugging

**Production Recommendation**: Remove `/eval` command in production deployments or ensure strong access control.

### Input Validation

While this template includes basic permission checks, consider adding:

- Rate limiting for commands
- Input sanitization for user-provided data
- Command cooldowns
- Guild-specific permission systems

### Dependency Security

Run security audits regularly:

```bash
npm audit
npm audit fix
```

Keep dependencies updated:
```bash
npm update
```

### Intents and Permissions

This template uses minimal intents by default (`GatewayIntentBits.Guilds`):

```javascript
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})
```

**Only add intents you need**:
- `GatewayIntentBits.GuildMessages` - Read messages
- `GatewayIntentBits.MessageContent` - Access message content (privileged)

For privileged intents, enable them in [Discord Developer Portal](https://discord.com/developers/applications).

### Error Handling

The template includes error handling that prevents stack trace exposure in production:

```javascript
// Set NODE_ENV=production to hide detailed errors from users
NODE_ENV=production npm start
```

In production mode, users see generic error messages while full details are logged server-side.

### Database Security (When Adding)

If adding a database:

1. **Use parameterized queries** to prevent SQL injection
2. **Encrypt sensitive data** at rest
3. **Use connection pooling** properly
4. **Never log sensitive data** (tokens, passwords, etc.)
5. **Implement proper access control**

### Hosting Security

When deploying:

- ✅ Use HTTPS for webhooks/APIs
- ✅ Keep server OS and Node.js updated
- ✅ Use process managers (PM2, systemd)
- ✅ Implement proper logging (but don't log secrets)
- ✅ Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- ❌ Don't expose internal ports publicly

### Common Vulnerabilities

**Prototype Pollution**: Avoid using `eval()` with user input (already limited to owners only)

**Denial of Service**: Implement rate limiting and command cooldowns for public commands

**Information Disclosure**: Error handler already prevents stack trace exposure to users

## Security Checklist

Before deploying to production:

- [ ] `.env` is in `.gitignore` and not committed
- [ ] Bot token is not hardcoded anywhere
- [ ] `OWNER_ID` is correctly configured
- [ ] `/eval` command is removed or access-controlled
- [ ] `NODE_ENV=production` is set
- [ ] Dependencies are up to date (`npm audit`)
- [ ] Rate limiting is implemented for public commands
- [ ] Error logging doesn't expose sensitive information
- [ ] Privileged intents are enabled if needed

## Additional Resources

- [Discord Developer Documentation](https://discord.com/developers/docs)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
