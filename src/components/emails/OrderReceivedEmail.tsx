import { ShippingAddress } from "@prisma/client";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

type OrderReceivedEmailProps = {
  shippingAddress: ShippingAddress;
  orderId: string;
  orderDate: string;
};
export default function OrderReceivedEmail({
  shippingAddress,
  orderId,
  orderDate,
}: OrderReceivedEmailProps) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://over-risk.vercel.app";
  return (
    <Html>
      <Head />
      <Preview>Resumen de tu orden en OverRisk</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Img
              src={`${baseUrl}/overrisk-logo.png`}
              width="65"
              height="73"
              alt="OverRisk logo"
              style={{ margin: "auto" }}
            />
            <Heading style={global.heading}>¡Gracias por tu compra!</Heading>

            <Text style={global.text}>
              Hola, tu orden ha sido recibida y está siendo procesada. Te
              notificaremos cuando tu orden haya sido enviada. El envío puede
              tardar entre 3 y 5 días hábiles.
            </Text>
            <Text style={{ ...global.text, marginTop: 24 }}>
              Si tienes alguna pregunta sobre tu orden, por favor escribe a
              soporte@overrisk.com con tu número de orden.
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Text style={adressTitle}>
              Dirección de envío para {shippingAddress.name}
            </Text>
            <Text style={{ ...global.text, fontSize: 14 }}>
              {shippingAddress.street}, {shippingAddress.city},{" "}
              {shippingAddress.state}, {shippingAddress.postalCode}
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Row style={{ display: "inline-flex", marginBottom: 40 }}>
              <Column style={{ width: 170 }}>
                <Text style={global.paragraphWithBold}>Número de orden:</Text>
                <Text style={track.number}> {orderId} </Text>
              </Column>
              <Column>
                <Text style={global.paragraphWithBold}>Fecha de la orden:</Text>
                <Text style={track.number}> {orderDate} </Text>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={paddingY}>
            <Row>
              <Text style={{...footer.text, paddingBottom: 30, paddingTop: 30}}>
                Contactanos si tienes alguna pregunta. (Si respondes a este correo, no recibiremos tu mensaje). Escribe a soporte@overrisk.com
              </Text>
            </Row>
            <Row>
              <Text style={footer.text}>
                © OverRisk. Todos los derechos reservados.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "220px",
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    color: "#000",
  } as React.CSSProperties,
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const track = {
  container: {
    padding: "22px 40px",
    backgroundColor: "#F7F7F7",
  },
  number: {
    margin: "12px 0 0 0",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#6F6F6F",
  },
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;

const adressTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};

const footer = {
  policy: {
    width: "166px",
    margin: "auto",
  },
  text: {
    margin: "0",
    color: "#AFAFAF",
    fontSize: "13px",
    textAlign: "center",
  } as React.CSSProperties,
};
