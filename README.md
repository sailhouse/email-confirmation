# Email Confirmation Service

A Netlify-powered email confirmation service designed to integrate with [Sailhouse](https://sailhouse.dev) event-driven systems. This project provides a simple way to verify email addresses through double opt-in confirmation for newsletter or changelog subscriptions.

## Features

- Simple Netlify deployment
- Customizable branding
- Double opt-in email confirmation flow
- Support for Postmark and Resend email providers (easy to add more with a PR or in a fork)
- Seamless integration with Sailhouse events
- TypeScript-based Netlify Functions
- Secure HMAC-based tokens for verification
- Email subscriber persistence using Netlify Blob Store
- Summary reporting to Slack for subscription activity

Note - you'll need to process the confirmed emails yourself, but a similar process of a function in Netlify or another service receiving push events from Sailhouse will make that very easy to do.

## How It Works

1. A Sailhouse push event containing an email address is received by the subscription endpoint (from e.g. your sales website)
2. The service validates the email format
3. A confirmation email is sent to the user with a secure HMAC-signed verification link
4. When the user clicks the link, their verification is validated, stored in Netlify Blob Store, and recorded in Sailhouse
5. A success page is displayed to the user
6. Admin summaries of subscription activities can be sent to Slack

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- A Sailhouse account with API key
- An email service account (e.g. Postmark or [Resend](https://resend.com/))

### Installation

1. Clone (or fork) the repository:

   ```bash
   git clone https://github.com/sailhouse/email-confirmation.git
   cd email-confirmation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in the `.env` file:

   ```bash
   SAILHOUSE_API_KEY=your_sailhouse_api_key
   SAILHOUSE_SIGNATURE=your_sailhouse_signature
   CONFIRMATION_TOPIC=confirmation-topic
   CONFIRMATION_SUBSCRIPTION=confirmation-subscription
   RESEND_API_KEY=your_postmark_api_key
   FROM_EMAIL=your-sender@example.com
   MAILING_LIST_NAME="Your Mailing List"
   COMPANY_NAME="Your Company"
   TOKEN_SECRET=your_secure_random_token_secret
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

   > **⚠️ SECURITY WARNING**: The `TOKEN_SECRET` should be a secure, random string and must be kept confidential.
   > This secret is used to sign verification tokens and protect against tampering. If compromised,
   > an attacker could forge verification tokens for any email address.
   > Generate a strong random string (at least just some gibberish 32 characters) and never commit it to version control.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Optional: Run linting and type checking:

   ```bash
   # Check for linting issues
   npm run lint

   # Fix linting issues automatically
   npm run lint:fix

   # Check for type errors
   npm run typecheck
   ```

### Deployment to Netlify

1. Push your code to a Git repository

2. Connect your repository to Netlify

3. Configure the environment variables in the Netlify UI:
   - Go to Site settings > Build & deploy > Environment
   - Add the same variables from your `.env` file (Netlify even offers conversation from that file)

## Customization

### Branding

1. Replace the logo and update colors in the HTML files in the `public` directory
2. Modify the email template in `src/emails/ConfirmationEmail.tsx`

### Email Provider

You can choose between Postmark and Resend by setting the appropriate environment variables:

For Postmark:

```bash
POSTMARK_API_KEY=your_postmark_api_key
MESSAGE_STREAM=outbound
FROM_EMAIL=your-sender@example.com
```

For Resend:

```bash
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your-sender@example.com
```

### Netlify Integration

The service automatically uses Netlify's context object to determine the site URL, so you don't need to configure the URL separately.

## Sailhouse Integration

This service integrates with Sailhouse by:

1. Receiving push events from Sailhouse at the `/api/subscribe` endpoint. Our website populates these events when someone subscribes.
2. Processing the event to send a confirmation email
3. Publishing confirmation events when users verify their email
4. Generating summary reports of subscription activity

### Setting Up Sailhouse

1. Create a _push_ subscription pointing to your Netlify function:

   ```bash
   https://your-netlify-app.netlify.app/api/subscribe
   ```

2. Configure your Sailhouse topics in the `.env` file:

   ```bash
   CONFIRMATION_TOPIC=changelog-confirmation
   ```

3. Setup a Sailhouse Cron to trigger (for example every day at 9am), which sends an event to a topic which has a push subscription set to:

   ```bash
   https://your-netlify-app.netlify.app/api/summary
   ```

4. This relies on a _pull_ subscription being setup on the topic used for confirmations you are using when `/api/confirm/ runs`, and then setting this in the .env file:

   ```bash
   CONFIRMATION_SUBSCRIPTION=confirmation-subscription
   ```

## Slack Integration

The summary handler can send reports to a Slack channel:

### Option 1: Using a Slack App with Incoming Webhooks

1. Create a new Slack app in your workspace at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable incoming webhooks feature
3. Create a webhook for your desired channel
4. Add the webhook URL to your environment variables

### Option 2: Using Slack Workflow Builder

1. In Slack, create a new workflow from the workflow builder
2. Select "Webhook" as the trigger
3. Configure the workflow steps to process the incoming data
4. Copy the generated webhook URL
5. Add the webhook URL to your environment variables:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/workflows/xxx/yyy/zzz
```

The summary handler will format the subscriber data into a well-structured message that works with both methods.

If you don't want to use this, then delete that bit of the code. It's pretty easily separated out.

## Netlify Blob Store

This service uses Netlify Blob Store to persistently store subscriber information:

1. Blob storage is automatically enabled for your Netlify site
2. No additional configuration is required
3. Subscriber data is stored using the email address as the key

This demo doesn't do much with it, but it's there for all other functions, and via the CLI, to pull out emails as needed in any other processing.

## Security Features

### Secure Tokens

This service uses HMAC-based tokens to secure verification links:

1. Tokens are created using the email address and a secret key (set as `TOKEN_SECRET`)
2. The token combines the email with a cryptographic signature
3. Tokens are validated before any action is taken
4. Token tampering will be detected and rejected

> **⚠️ SECURITY WARNING**: The `TOKEN_SECRET` environment variable must be kept secure.
> If compromised, an attacker could forge verification tokens for any email address.

### Token Testing Utility

A utility script is included to help test token generation and verification:

```bash
# Generate a token for testing
npm run token-test generate test@example.com

# Verify a token
npm run token-test verify <token>

# Show help information
npm run token-test help
```

See the [scripts/README.md](scripts/README.md) file for more details on using this utility.

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
