import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  companyName: string;
  clientName: string;
  phone: string;
  serviceName: string;
  preferredStartTime: string;
  leadId: number;
};

export default function NewLeadEmail({
  companyName,
  clientName,
  phone,
  serviceName,
  preferredStartTime,
  leadId,
}: Props) {
  const cleanedPhone = phone.replace(/\D/g, "");

  return (
    <Html>
      <Head />

      <Preview>
        New enquiry from {clientName} for {serviceName}
      </Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.eyebrow}>NEW WEBSITE ENQUIRY</Text>

            <Heading style={styles.heading}>
              A new client requested a consultation
            </Heading>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.intro}>
              A new enquiry has been submitted through the {companyName}
              website.
            </Text>

            <Hr style={styles.divider} />

            <Section>
              <Text style={styles.label}>Client name</Text>
              <Text style={styles.value}>{clientName}</Text>

              <Text style={styles.label}>Phone / WhatsApp</Text>
              <Text style={styles.value}>{phone}</Text>

              <Text style={styles.label}>Service required</Text>
              <Text style={styles.value}>{serviceName}</Text>

              <Text style={styles.label}>Preferred start time</Text>
              <Text style={styles.value}>{preferredStartTime}</Text>

              <Text style={styles.label}>Lead ID</Text>
              <Text style={styles.value}>#{leadId}</Text>
            </Section>

            <Section style={styles.buttonRow}>
              <Button
                href={`tel:${cleanedPhone}`}
                style={styles.primaryButton}
              >
                Call Client
              </Button>

              <Button
                href={`https://wa.me/${cleanedPhone}`}
                style={styles.secondaryButton}
              >
                Open WhatsApp
              </Button>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.footer}>
              This enquiry was generated automatically from the {companyName}
              website.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: "0",
    padding: "32px 12px",
    backgroundColor: "#f2f2ef",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
    overflow: "hidden",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
  },

  header: {
    padding: "32px",
    backgroundColor: "#080808",
  },

  eyebrow: {
    margin: "0",
    color: "#a3e635",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
  },

  heading: {
    margin: "14px 0 0",
    color: "#ffffff",
    fontSize: "30px",
    lineHeight: "1.2",
  },

  content: {
    padding: "32px",
  },

  intro: {
    margin: "0",
    color: "#555555",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  divider: {
    margin: "26px 0",
    borderColor: "#e5e5e5",
  },

  label: {
    margin: "18px 0 4px",
    color: "#777777",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
  },

  value: {
    margin: "0",
    color: "#111111",
    fontSize: "17px",
    fontWeight: "700",
    lineHeight: "1.5",
  },

  buttonRow: {
    marginTop: "28px",
  },

  primaryButton: {
    display: "inline-block",
    marginRight: "12px",
    padding: "14px 22px",
    borderRadius: "999px",
    backgroundColor: "#a3e635",
    color: "#000000",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
  },

  secondaryButton: {
    display: "inline-block",
    padding: "14px 22px",
    borderRadius: "999px",
    backgroundColor: "#111111",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
  },

  footer: {
    margin: "0",
    color: "#888888",
    fontSize: "12px",
    lineHeight: "1.6",
  },
};