# Email Confirmation Service

A Netlify-powered email confirmation service designed to integrate with [Sailhouse](https://sailhouse.dev) event-driven systems. This project provides a simple way to verify email addresses through double opt-in confirmation for newsletter or changelog subscriptions.

## Features

- Simple Netlify deployment
- Customizable branding
- Double opt-in email confirmation flow
- Support for Postmark and Resend email providers (easy to add more with a PR or in a fork)
- Seamless integration with Sailhouse events
- TypeScript-based Netlify Functions

Note - you'll need to process the confirmed emails yourself, but a similar process of a function in Netlify or another service receiving push events from Sailhouse will make that very easy to do.

## How It Works

1. A Sailhouse push event containing an email address is received by the subscription endpoint (from e.g. your sales website)
2. The service validates the email format
3. A confirmation email is sent to the user with a unique confirmation link
4. When the user clicks the link, their confirmation is recorded in Sailhouse
5. A success page is displayed to the user

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
   POSTMARK_API_KEY=your_postmark_api_key
   FROM_EMAIL=your-sender@example.com
   MAILING_LIST_NAME="Your Mailing List"
   COMPANY_NAME="Your Company"
   ```

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
   - Add the same variables from your `.env` file

## Customization

### Branding

1. Replace the logo and update colors in the HTML files in the `public` directory
2. Modify the email template in `src/emails/ConfirmationEmail.tsx`

### Email Provider

You can choose between Postmark and Resend by setting the appropriate environment variables:

For Postmark:

```bash
POSTMARK_API_KEY=your_postmark_api_key
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

1. Receiving push events from Sailhouse at the `/api/subscribe` endpoint
2. Processing the event to send a confirmation email
3. Publishing confirmation events when users verify their email

### Setting Up Sailhouse

1. Create a push subscription pointing to your Netlify function:

   ```bash
   https://your-netlify-app.netlify.app/api/subscribe
   ```

2. Configure your Sailhouse topics in the `.env` file:

   ```bash
   CONFIRMATION_TOPIC=changelog-confirmation
   ```

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
