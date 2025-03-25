import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConfirmationEmailProps {
  confirmationUrl: string;
  mailingListName: string;
  companyName: string;
  baseUrl: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({
  confirmationUrl,
  mailingListName,
  companyName,
  baseUrl,
}) => {
  const previewText = `Confirm your subscription to ${mailingListName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoContainer}>
            <Img
              src={`${baseUrl}/logo.png`}
              alt={`${companyName} Logo`}
              width="40"
              height="40"
              style={styles.logo}
            />
          </Section>
          <Heading style={styles.heading}>Confirm your subscription</Heading>
          <Text style={styles.text}>
            Thank you for subscribing to {mailingListName}. To complete your subscription, please
            confirm your email address by clicking the button below.
          </Text>
          <Section style={styles.buttonContainer}>
            <Button style={styles.button} href={confirmationUrl}>
              Confirm Subscription
            </Button>
          </Section>
          <Text style={styles.footerText}>
            If you didn&apos;t request this subscription, you can safely ignore this email.
          </Text>
          <Text style={styles.footerText}>
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const styles = {
  body: {
    backgroundColor: '#F8FAFC',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    margin: '0 auto',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0',
    maxWidth: '600px',
  },
  logoContainer: {
    marginBottom: '20px',
  },
  logo: {
    display: 'block',
  },
  heading: {
    color: '#0F172A',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.3',
    margin: '16px 0',
  },
  text: {
    color: '#334155',
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '16px 0',
  },
  buttonContainer: {
    margin: '26px 0',
  },
  button: {
    backgroundColor: '#ff8f3c',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '600',
    padding: '12px 20px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
  },
  footerText: {
    color: '#64748B',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '16px 0',
  },
};

export default ConfirmationEmail;
