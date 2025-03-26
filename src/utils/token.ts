import crypto from 'crypto';

/**
 * Generate a secure token for email verification links.
 * Uses HMAC with SHA-256 for token generation with a secret key.
 *
 * @param email The email address to encode in the token
 * @returns A secure token containing the email and signature
 */
export function generateSecureToken(email: string): string {
  if (!process.env.TOKEN_SECRET) {
    throw new Error('TOKEN_SECRET environment variable is not set');
  }

  // Create HMAC signature
  const hmac = crypto.createHmac('sha256', process.env.TOKEN_SECRET);
  hmac.update(email);
  const signature = hmac.digest('hex');

  // Combine email and signature in the token
  const tokenData = {
    email,
    signature,
  };

  // Base64 encode the combined data
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

/**
 * Verify and extract the email from a secure token.
 *
 * @param token The token to verify
 * @returns The extracted email if verification succeeds, or null if verification fails
 */
export function verifyAndExtractEmail(token: string): string | null {
  if (!process.env.TOKEN_SECRET) {
    throw new Error('TOKEN_SECRET environment variable is not set');
  }

  try {
    // Decode the token
    const decodedToken = Buffer.from(token, 'base64').toString();
    const tokenData = JSON.parse(decodedToken) as { email: string; signature: string };

    // Recreate the signature to verify
    const hmac = crypto.createHmac('sha256', process.env.TOKEN_SECRET);
    hmac.update(tokenData.email);
    const expectedSignature = hmac.digest('hex');

    // Compare signatures using a constant-time comparison to prevent timing attacks
    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(tokenData.signature),
      Buffer.from(expectedSignature)
    );

    return signaturesMatch ? tokenData.email : null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
