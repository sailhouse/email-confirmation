import { Context, Config } from '@netlify/functions';
import { validate } from 'email-validator';

export default async (req: Request, _context: Context) => {
  // Only accept GET requests for confirmation links
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Parse the URL to get the token
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response('Missing token', { status: 400 });
    }

    // Decode the email from the token
    const email = Buffer.from(token, 'base64').toString();

    // Validate the email
    if (!validate(email)) {
      return new Response('Invalid token', { status: 400 });
    }

    // Initialize Sailhouse client
    const { SailhouseClient } = await import('@sailhouse/client');
    const sailhouse = new SailhouseClient(process.env.SAILHOUSE_API_KEY || '');

    // Send confirmation event to Sailhouse
    await sailhouse.publish(process.env.CONFIRMATION_TOPIC || 'changelog-confirmation', {
      email,
      confirmed: true,
      timestamp: new Date().toISOString(),
    });

    console.log('Confirmation event sent to Sailhouse');

    // Redirect to success page
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/success.html',
      },
    });
  } catch (error) {
    console.error('Error processing confirmation:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

export const config: Config = {
  path: '/api/confirm',
};
