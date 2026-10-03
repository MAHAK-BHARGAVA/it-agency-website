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
  clientEmail?: string;
  phone: string;
  city?: string;
  serviceName: string;
  preferredStartTime?: string;
  message?: string;
  leadId: number;
};

export default function NewLeadEmail({
  companyName,
  clientName,
  clientEmail,
  phone,
  city,
  serviceName,
  preferredStartTime,
  message,
  leadId,
}: Props) {
  /*
   * Remove spaces, +, -, brackets, etc.
   *
   * Example:
   * +91 98765 43210
   * becomes:
   * 919876543210
   */
  const cleanedPhone = phone.replace(/\D/g, "");

  /*
   * WhatsApp requires the country code.
   * Since your website is targeting India,
   * automatically add 91 when it isn't already present.
   */
  const whatsappPhone = cleanedPhone.startsWith("91")
    ? cleanedPhone
    : `91${cleanedPhone}`;

  return (
    <Html>
      <Head />

      <Preview>
        New enquiry from {clientName} for {serviceName}
      </Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* ================= HEADER ================= */}

          <Section style={styles.header}>
            <Text style={styles.eyebrow}>
              NEW WEBSITE ENQUIRY
            </Text>

            <Heading style={styles.heading}>
              A new client wants to talk.
            </Heading>

            <Text style={styles.headerText}>
              A new enquiry has been submitted through{" "}
              {companyName} website.
            </Text>
          </Section>

          {/* ================= CONTENT ================= */}

          <Section style={styles.content}>

            <Text style={styles.sectionTitle}>
              CLIENT DETAILS
            </Text>

            <Hr style={styles.divider} />

            {/* CLIENT NAME */}

            <Text style={styles.label}>
              Client name
            </Text>

            <Text style={styles.value}>
              {clientName}
            </Text>

            {/* EMAIL */}

            <Text style={styles.label}>
              Email
            </Text>

            <Text style={styles.value}>
              {clientEmail || "Not provided"}
            </Text>

            {/* PHONE */}

            <Text style={styles.label}>
              Phone / WhatsApp
            </Text>

            <Text style={styles.value}>
              {phone}
            </Text>

            {/* CITY */}

            <Text style={styles.label}>
              City
            </Text>

            <Text style={styles.value}>
              {city || "Not provided"}
            </Text>

            {/* SERVICE */}

            <Text style={styles.label}>
              Service required
            </Text>

            <Text style={styles.value}>
              {serviceName}
            </Text>

            {/* PREFERRED START TIME */}

            <Text style={styles.label}>
              Preferred start time
            </Text>

            <Text style={styles.value}>
              {preferredStartTime || "Not provided"}
            </Text>

            {/* MESSAGE */}

            {message && (
              <>
                <Text style={styles.label}>
                  Project message
                </Text>

                <Section style={styles.messageBox}>
                  <Text style={styles.message}>
                    {message}
                  </Text>
                </Section>
              </>
            )}

            {/* LEAD ID */}

            <Text style={styles.label}>
              Lead ID
            </Text>

            <Text style={styles.value}>
              #{leadId}
            </Text>

            {/* ================= ACTION BUTTONS ================= */}

            <Section style={styles.buttonRow}>
              <Button
                href={`tel:${cleanedPhone}`}
                style={styles.primaryButton}
              >
                Call Client
              </Button>

              <Button
                href={`https://wa.me/${whatsappPhone}`}
                style={styles.secondaryButton}
              >
                Open WhatsApp
              </Button>
            </Section>

            <Hr style={styles.divider} />

            {/* ================= FOOTER ================= */}

            <Text style={styles.footer}>
              This enquiry was generated automatically
              from the {companyName} website.
            </Text>

            <Text style={styles.footer}>
              Please contact the client using the
              details above.
            </Text>

          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {
  body: {
    margin: "0",
    padding: "32px 12px",
    backgroundColor: "#f2f2ef",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
    overflow: "hidden",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
  },

  header: {
    padding: "36px 32px 38px",
    backgroundColor: "#080808",
  },

  eyebrow: {
    margin: "0",
    color: "#a3e635",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2.5px",
  },

  heading: {
    margin: "14px 0 0",
    color: "#ffffff",
    fontSize: "30px",
    lineHeight: "1.2",
    fontWeight: "800",
  },

  headerText: {
    margin: "14px 0 0",
    color: "#a5a5a5",
    fontSize: "14px",
    lineHeight: "1.7",
  },

  content: {
    padding: "34px 32px",
  },

  sectionTitle: {
    margin: "0",
    color: "#999999",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
  },

  divider: {
    margin: "22px 0",
    borderColor: "#e7e7e7",
  },

  label: {
    margin: "20px 0 5px",
    color: "#888888",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
  },

  value: {
    margin: "0",
    color: "#111111",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "1.5",
  },

  messageBox: {
    marginTop: "8px",
    padding: "16px 18px",
    borderRadius: "12px",
    backgroundColor: "#f5f5f0",
  },

  message: {
    margin: "0",
    color: "#333333",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  buttonRow: {
    marginTop: "30px",
  },

  primaryButton: {
    display: "inline-block",
    marginRight: "10px",
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
    margin: "6px 0 0",
    color: "#999999",
    fontSize: "12px",
    lineHeight: "1.6",
  },
};