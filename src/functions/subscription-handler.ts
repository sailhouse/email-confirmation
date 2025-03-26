import { Context, Config } from '@netlify/functions';
import { validate } from 'email-validator';
import { sendConfirmationEmail } from '../utils/email';
import { generateSecureToken } from '../utils/token';

export default async (req: Request, context: Context) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Validate Sailhouse signature
    const shSignature = req.headers.get('sh-signature');
    const sailhouseSignature = process.env.SAILHOUSE_SIGNATURE;

    if (!shSignature || shSignature !== sailhouseSignature) {
      console.error('Invalid signature');
      return new Response('Unauthorized', { status: 403 });
    }

    // Parse the request body
    const body = await req.json();

    // Extract email from the Sailhouse event
    const email = body.email;

    // Basic validation
    if (!email || !validate(email)) {
      console.error('Invalid or missing email address:', email);
      return new Response('Invalid email format', { status: 400 });
    }

    // Create confirmation URL with secure token
    const token = generateSecureToken(email);
    const confirmationUrl = `${context.site.url}/api/confirm?token=${token}`;

    // Send confirmation email
    const emailSent = await sendConfirmationEmail({
      to: email,
      confirmationUrl,
      mailingListName: process.env.MAILING_LIST_NAME || 'Our Mailing List',
      companyName: process.env.COMPANY_NAME || 'Your Company',
      baseUrl: `${context.site.url}`,
    });

    if (!emailSent) {
      console.error('Failed to send confirmation email');
      return new Response('Failed to send confirmation email', { status: 500 });
    }

    console.log('Confirmation email sent');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const config: Config = {
  path: '/api/subscribe',
};
