import { sailhouseClient, SIGNATURE } from '@/utils/sailhouse';
import { Context, Config } from '@netlify/functions';

interface SummaryStats {
  totalConfirmations: number;
  confirmedEmails: string[];
}

export default async (req: Request, _context: Context) => {
  // Only accept POST requests from Sailhouse
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const shSignature = req.headers.get('Sailhouse-Signature');
    const body = await req.text();

    if (!shSignature) {
      return new Response('Missing Sailhouse signature', { status: 401 });
    }

    const valid = sailhouseClient.verifyPushSubscription(shSignature, body, SIGNATURE);

    if (!valid) {
      return new Response('Invalid Sailhouse signature', { status: 401 });
    }

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.error('SLACK_WEBHOOK_URL environment variable is not set');
      return new Response('Configuration error', { status: 500 });
    }

    // Process and summarize events after ensuring we are configured correctly
    const summary = await summarizeEvents();
    const success = await sendToSlack(slackWebhookUrl, summary);

    if (!success) {
      return new Response('Failed to send summary to Slack', { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing summary request:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

/**
 * Summarize Sailhouse events into a structured summary object
 */
async function summarizeEvents(): Promise<SummaryStats> {
  // Initialize summary stats
  const summary: SummaryStats = {
    totalConfirmations: 0,
    confirmedEmails: [],
  };

  const { SailhouseClient } = await import('@sailhouse/client');
  const sailhouse = new SailhouseClient(process.env.SAILHOUSE_API_KEY || '');

  let confirmationEvent = await sailhouse.pull(
    process.env.CONFIRMATION_TOPIC || 'changelog-confirmation',
    process.env.CONFIRMATION_SUBSCRIPTION || 'changelog-confirm-summary'
  );
  while (confirmationEvent !== null) {
    try {
      if (
        confirmationEvent?.data &&
        typeof confirmationEvent.data === 'object' &&
        'email' in confirmationEvent.data
      ) {
        summary.totalConfirmations++;
        summary.confirmedEmails.push(confirmationEvent.data.email as string);
      }

      // Acknowledge successful processing
      await confirmationEvent.ack();

      confirmationEvent = await sailhouse.pull(
        process.env.CONFIRMATION_TOPIC || 'changelog-confirmation',
        process.env.CONFIRMATION_SUBSCRIPTION || 'changelog-confirm-summary'
      );
    } catch (error) {
      // Event will automatically return to queue after lock expires
      console.error('Failed to process confirm event:', error);
      break;
    }
  }

  return summary;
}

/**
 * Send the summary to Slack via webhook
 */
async function sendToSlack(webhookUrl: string, summary: SummaryStats): Promise<boolean> {
  try {
    const message = {
      totalConfirmations: summary.totalConfirmations,
      confirmedEmails: summary.confirmedEmails.join(',\n'),
    };

    const { default: fetch } = await import('node-fetch');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Failed to send to Slack:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending to Slack:', error);
    return false;
  }
}

export const config: Config = {
  path: '/api/summary',
};
