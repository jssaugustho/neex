import { User as iUser } from "@prisma/client";
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
import React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const AuthenticationEmail = (props: { token: string; user: iUser }) => (
  <Html>
    <Head />
    <Preview>Faça login via email.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            width="265px"
            height="58px"
            src={`https://cloud.luxcrm.space/neex-logo.png`}
            alt="Stripe"
          />
          <Hr style={hr} />
          <Text style={title}>
            Faça seu login via email utilizando o link abaixo.
          </Text>
          <Text style={paragraph}>
            Após o login da sua senha você terá acesso às suas contas no Lux
            CRM.
          </Text>
          <Text style={paragraph}>
            Nós nunca vamos te ligar ou enviar mensagem pra você solicitando
            esse link, ao levantar qualquer suspeita de fraude você deve entrar
            em contato com o nosso suporte.
          </Text>
          <Button
            style={button}
            href={`${process.env.SPA_URL}/onboarding?token=${props.token}`}
          >
            Fazer Login
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            Caso você suspeite de alguma atividade em seu email, entre em
            contato com o nosso suporte urgentemente.
          </Text>
          <Text style={paragraph}>— Equipe Neex.</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Av. Brigadeiro Faria Lima, 2506 - 11º andar - São Paulo, SP
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    'Montserrat, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  margin: "16px auto",
  width: "100%",
  maxWidth: "600px",
  height: "100%",
  padding: "32px 16px",
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

const title = {
  color: "#00010b",
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: "34px",
  textAlign: "left" as const,
};

const button = {
  boxSizing: "border-box" as const,
  backgroundColor: "#FF0062",
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

export default AuthenticationEmail;
