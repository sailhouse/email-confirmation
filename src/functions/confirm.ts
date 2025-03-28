import { Context, Config } from '@netlify/functions';
import { validate } from 'email-validator';
import { getSubscriberBlobStore } from '../utils/blobStore';
import { verifyAndExtractEmail } from '../utils/token';

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

    // Verify and decode the email from the token
    const email = verifyAndExtractEmail(token);

    if (!email) {
      return new Response('Invalid token', { status: 400 });
    }

    if (!validate(email)) {
      return new Response('Invalid email', { status: 400 });
    }

    // Get current timestamp
    const timestamp = new Date().toISOString();

    const blobStore = getSubscriberBlobStore();
    if (!blobStore) {
      console.error('Failed to initialize Blob Store');
      return new Response('Internal server error', { status: 500 });
    }

    try {
      // Check if email already exists in the blob store
      const existingEmail = await blobStore.get(email);

      // This will intentionally overwrite any existing data for the email
      await blobStore.setJSON(email, {
        email,
        timestamp,
      });

      console.log('Email saved to Blob Store');

      // Only send Sailhouse event if email doesn't already exist
      if (!existingEmail) {
        // Initialize Sailhouse client
        const { SailhouseClient } = await import('@sailhouse/client');
        const sailhouse = new SailhouseClient(process.env.SAILHOUSE_API_KEY || '');

        // Send confirmation event to Sailhouse
        await sailhouse.publish(process.env.CONFIRMATION_TOPIC || 'changelog-confirmation', {
          email,
          confirmed: true,
          timestamp,
        });

        console.log('Confirmation event sent to Sailhouse');
      } else {
        console.log('Email already exists, skipping Sailhouse event');
      }
    } catch (storeError) {
      console.error('Error saving to blob store:', storeError);
      return new Response('Internal server error', { status: 500 });
    }

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
