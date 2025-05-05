import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const WelcomeEmail = (token: string) => (
  <Html>
    <Head />
    <Preview>
      Nós detectamos um novo acesso na sua conta na cidade de Uberlândia, Minas
      Gerais.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://luxdigitalstudio.com.br/light-theme-logo.png`}
            width="218"
            height="67"
            alt="Stripe"
          />
          <Hr style={hr} />
          <Text style={title}>Novo login detectado em Uberlândia, MG.</Text>
          <Text style={paragraph}>
            Nós detectamos um novo acesso na sua conta na cidade de Uberlândia,
            MG.
          </Text>
          <Text style={paragraph}>
            Não foi você? Clique no botão abaixo e bloqueie o acesso.
          </Text>
          <Button
            style={button}
            href={`https://app.luxcrm.co/security/block-session?token=${token}`}
          >
            Bloquear acesso.
          </Button>
          <Hr style={hr} />
          <Text style={title2}>Informações da sessão:</Text>
          <ul style={ul}>
            <li style={li}>🖥️ Windows / Chrome</li>
            <li style={li}>📍 Uberlândia, MG, BR</li>
            <li style={li}>📅 10/10/2023</li>
            <li style={li}>⏰ 14:30</li>
          </ul>
          <Text style={paragraph}>— Equipe Lux Digital.</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Av. Brigadeiro Faria Lima, 2506 - 11º andar - São Paulo, SP
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    'Montserrat, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px",
  height: "100%",
  padding: "20px",
  marginBottom: "64px",
  border: "solid 4px #6b6b6b",
  alignContent: "center",
};

const box = {
  padding: "0 ",
  width: "100%",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const ul = {
  listStyleType: "none" as const,
  padding: "0",
  margin: "0",
};

const li = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "32px",
  textAlign: "left" as const,
};

const title = {
  color: "#00010b",
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: "34px",
  textAlign: "left" as const,
};

const title2 = {
  color: "#00010b",
  fontSize: "18px",
  lineHeight: "24px",
  textAlign: "left" as const,
  fontWeight: "bold",
};

const button = {
  boxSizing: "border-box" as const,
  backgroundColor: "#0f59b2",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "16px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "18px",
};
