# Email Verification Testing Scripts

This directory contains utility scripts for testing the email verification system.

## Token Test Utility

The `token-test.ts` script allows you to generate and verify secure tokens for testing.

### Usage

```bash
# Generate a token for a test email
npm run token-test generate test@example.com

# Verify a token
npm run token-test verify <token>

# Show help information
npm run token-test help
```

### Setting a Custom Secret

By default, the script uses a test secret key. You can override this by setting the `TOKEN_SECRET` environment variable:

```bash
TOKEN_SECRET="your-custom-secret" npm run token-test generate test@example.com
```

### Example Output

When generating a token:

```bash
Generated token for email: test@example.com

Token: eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJzaWduYXR1cmUiOiJhYmMxMjMifQ==

Verified email from token: test@example.com

Example usage in URL:
https://your-site.netlify.app/api/confirm?token=eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJzaWduYXR1cmUiOiJhYmMxMjMifQ%3D%3D
```

When verifying a token:

```bash
Token is valid!
Email extracted from token: test@example.com
```

## Testing in Local Development

1. Start your local development server: `npm run dev`
2. Generate a test token using this utility
3. Use the token in your confirmation URL
4. Test the complete flow in your local environment
