//types
import { Session as iSession, User as iUser } from "@prisma/client";

//external libs
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
import { Lookup } from "geoip-lite";
import React from "react";
import iSessionPayload from "../../../@types/iSessionPayload/iSessionPayload.js";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const NewLoginDetected = (props: { user: iUser; session: iSessionPayload }) => {
  const timeZone = {
    timeZone: props.session.ip.timeZone || "America/Sao_Paulo", // Exemplo: horário de Brasília
  };

  return (
    <Html>
      <Head />
      <Preview>
        Nós detectamos um novo acesso na sua conta {props.user.name}.
      </Preview>
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
              Novo login detectado na sua conta {props.user.name}.
            </Text>
            <Text style={paragraph}>
              Nós detectamos um novo acesso na sua conta na cidade de{" "}
              {props.session.ip.city}, {props.session.ip.region}.
            </Text>
            <Text style={paragraph}>
              Não foi você? Clique no botão abaixo e bloqueie o acesso.
            </Text>
            <Button
              style={button}
              href={`${process.env.WEB_CLIENT_URL}/security/session?session=${props.session.id}`}
            >
              Bloquear acesso.
            </Button>
            <Hr style={hr} />
            <Text style={title2}>Informações da sessão:</Text>
            <ul style={ul}>
              <li style={li}>{props.session.name}</li>
              <li style={li}>
                📍 {props.session.ip.city + ", " || "Desconhecido"}
                {props.session.ip.region + ", " || ""}
                {props.session.ip.country || ""}
              </li>
              <li style={li}>
                📅 {new Date().toLocaleDateString("pt-BR", timeZone)}
              </li>
              <li style={li}>
                ⏰ {new Date().toLocaleTimeString("pt-BR", timeZone)}
              </li>
            </ul>
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
};

export default NewLoginDetected;

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

const title2 = {
  color: "#00010b",
  fontSize: "18px",
  lineHeight: "24px",
  textAlign: "left" as const,
  fontWeight: "bold",
};

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
