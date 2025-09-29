import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
} from '@react-email/components'

interface WelcomeEmailProps {
  name?: string
}

export default function WelcomeEmail({ name = 'Nutzer' }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Willkommen bei OK9 SaaS! 🚀</Heading>

          <Text style={text}>Hallo {name},</Text>

          <Text style={text}>
            Vielen Dank für Ihre Registrierung bei OK9 SaaS Starter Kit.
            Wir freuen uns, Sie in unserer Community begrüßen zu dürfen!
          </Text>

          <Section style={features}>
            <Text style={featuresTitle}>Sie haben jetzt Zugang zu:</Text>
            <ul style={featuresList}>
              <li>📊 Professionelles Dashboard</li>
              <li>💳 Flexible Abonnement-Pläne</li>
              <li>📈 Erweiterte Analytics</li>
              <li>🔧 API-Zugang</li>
              <li>🎨 UI Components Showcase</li>
            </ul>
          </Section>

          <Section style={cta}>
            <Link
              href={`${process.env.NEXTAUTH_URL}/dashboard`}
              style={button}
            >
              Dashboard besuchen
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Bei Fragen stehen wir Ihnen gerne zur Verfügung. Antworten Sie einfach auf diese E-Mail.
          </Text>

          <Text style={footer}>
            Mit freundlichen Grüßen,<br />
            Das OK9 SaaS Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '32px',
  margin: '16px 0',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const features = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const featuresTitle = {
  ...text,
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const featuresList = {
  ...text,
  margin: '0',
  paddingLeft: '0',
  listStyle: 'none',
}

const cta = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '20px',
  padding: '12px 24px',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  ...text,
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
}