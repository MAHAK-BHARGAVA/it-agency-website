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

interface OTPEmailProps {
  otp: string;
}

export default function OTPEmail({ otp }: OTPEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Your Social3 verification code</Preview>

      <Body
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "16px",
          }}
        >
          <Heading
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            Verify your email
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            Use the verification code below to continue your enquiry with
            Social3.
          </Text>

          <Section
            style={{
              textAlign: "center",
              margin: "30px 0",
            }}
          >
            <Text
              style={{
                fontSize: "36px",
                fontWeight: "700",
                letterSpacing: "8px",
                margin: "0",
              }}
            >
              {otp}
            </Text>
          </Section>

          <Text
            style={{
              fontSize: "14px",
              color: "#777",
            }}
          >
            This code will expire in 10 minutes.
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#777",
            }}
          >
            If you did not request this code, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}