import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface EmailVerificationEmailProps {
  verificationUrl: string;
  appName?: string;
}

export const EmailVerificationEmail = ({ verificationUrl = '#', appName = 'Our App' }: EmailVerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for {appName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={text}>
          Thanks for signing up for {appName}! Please verify your email address by clicking the button below.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Verify Email
          </Button>
        </Section>
        <Text style={linkText}>Or copy and paste this link into your browser:</Text>
        <Text style={link}>{verificationUrl}</Text>
        <Text style={disclaimer}>If you didn&apos;t create an account, you can safely ignore this email.</Text>
        <Text style={footer}>— The {appName} Team</Text>
      </Container>
    </Body>
  </Html>
);

export default EmailVerificationEmail;

const main = {
  backgroundColor: '#f4f4f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const h1 = {
  color: '#18181b',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '40px 0 30px',
  padding: '0 40px',
};

const text = {
  color: '#3f3f46',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '27px 40px',
};

const button = {
  backgroundColor: '#18181b',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
};

const linkText = {
  color: '#a1a1aa',
  fontSize: '14px',
  padding: '0 40px',
  marginTop: '24px',
  marginBottom: '8px',
};

const link = {
  color: '#18181b',
  fontSize: '13px',
  padding: '0 40px',
  wordBreak: 'break-all' as const,
  display: 'block',
  marginTop: '8px',
  marginBottom: '16px',
};

const disclaimer = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.6',
  padding: '0 40px',
  marginTop: '32px',
};

const footer = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.6',
  padding: '0 40px',
  marginTop: '32px',
};
