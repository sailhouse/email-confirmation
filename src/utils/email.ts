import { render } from '@react-email/render';
import * as postmark from 'postmark';
import { Resend } from 'resend';
import React from 'react';
import ConfirmationEmail from '../emails/ConfirmationEmail';

type EmailProvider = 'postmark' | 'resend';

interface SendEmailOptions {
  to: string;
  confirmationUrl: string;
  mailingListName: string;
  companyName: string;
  baseUrl: string;
}

// Determine which email provider to use based on environment variables
const getEmailProvider = (): EmailProvider => {
  if (process.env.POSTMARK_API_KEY) {
    return 'postmark';
  } else if (process.env.RESEND_API_KEY) {
    return 'resend';
  }

  // Default to resend if no provider is explicitly configured
  return 'resend';
};

// Send email using Postmark
const sendWithPostmark = async (options: SendEmailOptions): Promise<boolean> => {
  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY || '');
    const html = render(
      React.createElement(ConfirmationEmail, {
        confirmationUrl: options.confirmationUrl,
        mailingListName: options.mailingListName,
        companyName: options.companyName,
        baseUrl: options.baseUrl,
      })
    );

    const text = render(
      React.createElement(ConfirmationEmail, {
        confirmationUrl: options.confirmationUrl,
        mailingListName: options.mailingListName,
        companyName: options.companyName,
        baseUrl: options.baseUrl,
      }),
      { plainText: true }
    );

    const response = await client.sendEmail({
      From: process.env.FROM_EMAIL || '',
      To: options.to,
      Subject: `Confirm your subscription to ${options.mailingListName}`,
      HtmlBody: html,
      TextBody: text,
      MessageStream: process.env.MESSAGE_STREAM || '',
    });

    return response.ErrorCode === 0;
  } catch (error) {
    console.error('Failed to send email with Postmark:', error);
    return false;
  }
};

// Send email using Resend
const sendWithResend = async (options: SendEmailOptions): Promise<boolean> => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const html = render(
      React.createElement(ConfirmationEmail, {
        confirmationUrl: options.confirmationUrl,
        mailingListName: options.mailingListName,
        companyName: options.companyName,
        baseUrl: options.baseUrl,
      })
    );

    const from = `${options.companyName} <${process.env.FROM_EMAIL || ''}>`;
    const response = await resend.emails.send({
      from: from,
      to: options.to,
      subject: `Confirm your subscription to ${options.mailingListName}`,
      html: html,
    });

    return !!response.data?.id;
  } catch (error) {
    console.error('Failed to send email with Resend:', error);
    return false;
  }
};

// Unified email sending function
export const sendConfirmationEmail = async (options: SendEmailOptions): Promise<boolean> => {
  const provider = getEmailProvider();

  switch (provider) {
    case 'postmark':
      return sendWithPostmark(options);
    case 'resend':
      return sendWithResend(options);
    default:
      console.error('No email provider configured');
      return false;
  }
};
