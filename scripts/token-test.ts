#!/usr/bin/env node
/**
 * Script to test token generation and verification
 *
 * Usage:
 * - To generate a token: npm run token-test generate test@example.com
 * - To verify a token: npm run token-test verify <token>
 */

import { generateSecureToken, verifyAndExtractEmail } from '../src/utils/token';

// Set a mock secret for testing
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'test-secret-key-do-not-use-in-production';

function generateTokenForEmail(email: string): void {
  try {
    const token = generateSecureToken(email);
    console.log('\nGenerated token for email:', email);
    console.log('\nToken:', token);

    // Also show the decoded data for verification
    const verified = verifyAndExtractEmail(token);
    console.log('\nVerified email from token:', verified);

    // Show how to use the token in a URL
    console.log('\nExample usage in URL:');
    console.log(`https://your-site.netlify.app/api/confirm?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error('Error generating token:', error);
  }
}

function verifyToken(token: string): void {
  try {
    const email = verifyAndExtractEmail(token);

    if (email) {
      console.log('\nToken is valid!');
      console.log('Email extracted from token:', email);
    } else {
      console.log('\nToken verification failed. Token may be invalid or tampered with.');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
  }
}

function showHelp(): void {
  console.log(`
Token Testing Utility

Commands:
  generate <email>  - Generate a secure token for the specified email
  verify <token>    - Verify a token and extract the email
  help              - Show this help message

Examples:
  npm run token-test generate test@example.com
  npm run token-test verify eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJzaWduYXR1cmUiOiJhYmMxMjMifQ==
  `);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();
  const argValue = args[1]; // Store the second argument

  switch (command) {
    case 'generate':
      if (!argValue) {
        console.error('Error: Email is required for token generation');
        showHelp();
        process.exit(1);
      }
      generateTokenForEmail(argValue);
      break;

    case 'verify':
      if (!argValue) {
        console.error('Error: Token is required for verification');
        showHelp();
        process.exit(1);
      }
      verifyToken(argValue);
      break;

    case 'help':
    default:
      showHelp();
      break;
  }
}

main();
