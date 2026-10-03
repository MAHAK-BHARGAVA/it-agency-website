import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ThankYouEmailProps {
  clientName: string;
  serviceName?: string;
}

export default function ThankYouEmail({
  clientName,
  serviceName,
}: ThankYouEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        We received your enquiry — Soclthry
      </Preview>

      <Body
        style={{
          backgroundColor: "#F5F5F0",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          margin: 0,
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#111313",
            padding: "48px",
          }}
        >
          <Text
            style={{
              color: "#B7F000",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "2px",
              margin: "0 0 32px",
            }}
          >
            SOCLTHRY
          </Text>

          <Heading
            style={{
              color: "#FFFFFF",
              fontSize: "32px",
              lineHeight: "1.1",
              margin: "0 0 24px",
            }}
          >
            Thanks for reaching out, {clientName}.
          </Heading>

          <Text
            style={{
              color: "#B8BAB3",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            We’ve received your enquiry and our team
            will review it shortly.
          </Text>

          {serviceName && (
            <Section
              style={{
                borderTop: "1px solid #333635",
                borderBottom: "1px solid #333635",
                padding: "20px 0",
                margin: "28px 0",
              }}
            >
              <Text
                style={{
                  color: "#888A84",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 8px",
                }}
              >
                Service
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: "16px",
                  margin: 0,
                }}
              >
                {serviceName}
              </Text>
            </Section>
          )}

          <Text
            style={{
              color: "#B8BAB3",
              fontSize: "15px",
              lineHeight: "1.7",
            }}
          >
            If you have any additional information
            to share, simply reply to this email.
          </Text>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: "15px",
              marginTop: "32px",
            }}
          >
            — Team Soclthry
          </Text>
        </Container>
      </Body>
    </Html>
  );
}