# Contributing to Email Confirmation

Thank you for considering contributing to this project! Any contributions you make will benefit the community.

## How to Contribute

### Reporting Bugs

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and what you expected to see
- Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are also tracked as GitHub issues. Provide the following information:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Explain why this enhancement would be useful
- Include code examples if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Workflow

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and fill in the required values
4. Start the development server with `npm run dev`
5. Before committing changes:

   ```bash
   # Check for linting issues
   npm run lint

   # Fix linting issues automatically
   npm run lint:fix

   # Check for type errors
   npm run typecheck
   ```

Note: The project is configured with pre-commit hooks that will automatically run linting and formatting on your code before each commit.

## Customizing the Email Confirmation Service

### Branding Customization

1. Replace the logo in the public directory
2. Update the HTML files in the public directory with your branding
3. Modify the styles in the HTML files to match your color scheme

### Email Template Customization

1. Modify the `ConfirmationEmail.tsx` file in the src/emails directory
2. Update the styles and content to match your branding

### Environment Configuration

The following environment variables are used to configure the service:

- `SAILHOUSE_API_KEY`: Your Sailhouse API key
- `SAILHOUSE_SIGNATURE`: Signature for validating Sailhouse webhooks
- `POSTMARK_API_KEY`: Your Postmark API key (if using Postmark)
- `MESSAGE_STREAM`: Your Postmark message stream to use (if using Postmark)
- `RESEND_API_KEY`: Your Resend API key (if using Resend)
- `FROM_EMAIL`: Email address to send from
- `MAILING_LIST_NAME`: Name of your mailing list
- `COMPANY_NAME`: Your company name
- `CONFIRMATION_TOPIC`: Topic to publish confirmation events to

Note: The application URL is automatically provided by Netlify through the context object.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
