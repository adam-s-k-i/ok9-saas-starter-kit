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
  Row,
  Column,
} from '@react-email/components'

interface InvoiceEmailProps {
  invoice: {
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }
  userName?: string
}

export default function InvoiceEmail({
  invoice,
  userName = 'Kunde'
}: InvoiceEmailProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Rechnung #{invoice.id.slice(-8)}</Heading>

          <Text style={text}>Hallo {userName},</Text>

          <Text style={text}>
            vielen Dank für Ihr Vertrauen in OK9 SaaS. Ihre Rechnung wurde erfolgreich verarbeitet.
          </Text>

          <Section style={invoiceDetails}>
            <Heading style={sectionTitle}>Rechnungsdetails</Heading>

            <Row>
              <Column style={labelColumn}>
                <Text style={label}>Rechnungsnummer:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>#{invoice.id.slice(-8)}</Text>
              </Column>
            </Row>

            <Row>
              <Column style={labelColumn}>
                <Text style={label}>Betrag:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{formatCurrency(invoice.amount, invoice.currency)}</Text>
              </Column>
            </Row>

            <Row>
              <Column style={labelColumn}>
                <Text style={label}>Datum:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{formatDate(invoice.createdAt)}</Text>
              </Column>
            </Row>

            <Row>
              <Column style={labelColumn}>
                <Text style={label}>Status:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={{...value, ...statusStyle(invoice.status)}}>
                  {invoice.status === 'paid' ? 'Bezahlt ✅' : 'Ausstehend ⏳'}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={cta}>
            <Link
              href={`${process.env.NEXTAUTH_URL}/dashboard/billing`}
              style={button}
            >
              Billing-Dashboard öffnen
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Diese Rechnung wurde automatisch erstellt. Bei Fragen kontaktieren Sie unseren Support.
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

const statusStyle = (status: string) => ({
  color: status === 'paid' ? '#10b981' : '#f59e0b',
  fontWeight: '600',
})

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

const sectionTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const invoiceDetails = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const labelColumn = {
  width: '40%',
  paddingRight: '12px',
}

const valueColumn = {
  width: '60%',
}

const label = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '8px 0',
}

const value = {
  color: '#111827',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0',
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